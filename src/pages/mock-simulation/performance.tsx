import { Select, Spin, TableProps } from "antd";
import { Option } from "antd/lib/mentions";
import { ArrowLeftOutlined, QuestionCircleFilled, SignalFilled } from "@ant-design/icons";
import { Table, Tooltip } from "antd";
import { Session } from "./types";
import { LineChart } from "@mui/x-charts/LineChart";
import { BarChart } from "@mui/x-charts/BarChart";
import { useEffect, useState } from "react";
import {
  getSessionDetail,
  getpackage,
} from "../../api/services/MockSimulation";
import { EXAM_APP_URL } from "../../config/app-config";
import moment from "moment";
import { ChartsReferenceLine } from "@mui/x-charts/ChartsReferenceLine";
import { Button } from 'antd';
import Papa from 'papaparse';

interface VerbalDataType {
  key: string;
  questions: string;
  correct: string;
  partially_correct: string;
  incorrect: string;
}

interface PredicatedDataType {
  key: string;
  subtest: string;
  score: string;
  type?: string;
  pr: number;
  data: number[];
  packageScore: number[];
  color: string;
}

type ScoreTable = {
  estimatedScore: number;
  vr: number;
  qr: number;
  ar: number;
  dm: number;
};

type BandRange = {
  band: number;
  minScore: number;
  maxScore: number;
};

const PredicatedColumns: TableProps<PredicatedDataType>["columns"] = [
  {
    title: "Subtest",
    dataIndex: "subtest",
    key: "subtest",
  },
  {
    title: "MissionMed Score",
    dataIndex: "score",
    key: "score",
  },
];
interface Props {
  mocks: Array<Session>;
  selectedMockId: number | undefined;
  setActiveTab: any;
}

function Performance({ mocks, selectedMockId, setActiveTab }: Props) {
  const [mockId, setMockId] = useState<number | undefined>(selectedMockId);
  const [mockData, setMockData] = useState<any>([]);
  const [scoreTableKey, setScoreTableKey] = useState<number>(52);
  const [predicatedData, setPredicatedData] = useState<PredicatedDataType[]>([
    {
      key: "1",
      subtest: "Verbal Reasoning",
      score: "-",
      type: "vr",
      pr: 0,
      data: [],
      packageScore: [],
      color: "#f098b2",
    },
    {
      key: "2",
      subtest: "Decision Making",
      score: "-",
      type: "dm",
      pr: 0,
      data: [],
      packageScore: [],
      color: "#f098b2",
    },
    {
      key: "3",
      subtest: "Quantitative Reasoning",
      score: "-",
      type: "qr",
      pr: 0,
      data: [],
      packageScore: [],
      color: "#f098b2",
    },
    {
      key: "4",
      subtest: "Abstract Reasoning",
      score: "-",
      type: "ar",
      pr: 0,
      data: [],
      packageScore: [],
      color: "#f098b2",
    },
    {
      key: "5",
      subtest: "Situational Judgement",
      score: "Band -",
      type: "sr",
      pr: 0,
      data: [],
      packageScore: [],
      color: "#f098b2",
    },
  ]);
  const [mine, setMine] = useState<number[]>([]);
  const [scores, setScores] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalScaledScore, setTotalScaledScore] = useState<number>(0)
  const [rank, setRank] = useState<number>(0)
  const [prOfBetterPerformed, setPrOfBetterPerformed] = useState<number | string>(0)
  const [UCATPR, setUCATPR] = useState<number>(0)
  const [scoreTable, setScoreTable] = useState<ScoreTable[]>([])
  const [sjtBands, setSjtBands] = useState<BandRange[]>([])
  const [ucatPercentile, setUcatPercentile] = useState([])

  useEffect(() => {
    if (selectedMockId) {
      setMockId(selectedMockId);
    }
  }, [selectedMockId]);

  useEffect(() => {
    const init = async () => {
      await setScores([]);
      await setMine([]);
      mockId && await getMockData();
    };
    init();
  }, [mockId]);

  useEffect(() => {
    if (totalScaledScore > 0 && ucatPercentile?.length > 0)
      getLastYearData()
  }, [totalScaledScore, ucatPercentile])

  function findEstimatedScore(
    rawScore: number,
    scoreType: keyof ScoreTable
  ): number {
    for (let i = scoreTable.length - 1; i >= 0; i--) {
      if (rawScore >= scoreTable[i][scoreType]) {
        return scoreTable[i].estimatedScore;
      }
    }
    return 300; // return the lowest score if raw score is below the minimum in the table
  }

  function calculateScores(
    rawScores: [number, number, number, number]
  ): [number, number, number, number] {
    const vrScore = findEstimatedScore(rawScores[0], "vr");
    const qrScore = findEstimatedScore(rawScores[1], "qr");
    const arScore = findEstimatedScore(rawScores[2], "ar");
    const dmScore = findEstimatedScore(rawScores[3], "dm");
    return [vrScore, dmScore, qrScore, arScore];
  }

  function determineSJTband(score: number): number {
    const foundBand = sjtBands.find(
      (band) => score >= band.minScore && score <= band.maxScore
    );
    if (!foundBand) {
      throw new Error("Invalid score: Score must be between 0 and 66.");
    }
    return foundBand.band;
  }

  async function getLastYearData() {
    try {

      if (ucatPercentile?.length > 0) {
        const lastScore = await ucatPercentile?.findIndex((i: any) => i['UCAT Scaled Score'] === '')
        if (totalScaledScore < Number(ucatPercentile[0]?.['UCAT Scaled Score']))
          await setUCATPR(0)
        else if (totalScaledScore > Number(ucatPercentile[(lastScore - 1)]?.['UCAT Scaled Score']))
          await setUCATPR(100)
        else {
          const percentage = await ucatPercentile.reduce((a: any, b: any) => (
            b?.['UCAT Scaled Score'] <= totalScaledScore && b?.['UCAT Scaled Score'] >= a?.['UCAT Scaled Score']
              ? b
              : a
          ), { ['UCAT Scaled Score']: -Infinity })
          await setUCATPR(percentage?.['Percentile'])
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  async function getPackageData(id: any) {
    try {
      await setLoading(true);

      const res = await getpackage(id);
      if (res.data) {
        await setPredicatedData([
          {
            key: "1",
            subtest: "Verbal Reasoning",
            score: "-",
            type: "vr",
            pr: 0,
            data: [],
            packageScore: [],
            color: "#f098b2",
          },
          {
            key: "2",
            subtest: "Decision Making",
            score: "-",
            type: "dm",
            pr: 0,
            data: [],
            packageScore: [],
            color: "#f098b2",
          },
          {
            key: "3",
            subtest: "Quantitative Reasoning",
            score: "-",
            type: "qr",
            pr: 0,
            data: [],
            packageScore: [],
            color: "#f098b2",
          },
          {
            key: "4",
            subtest: "Abstract Reasoning",
            score: "-",
            type: "ar",
            pr: 0,
            data: [],
            packageScore: [],
            color: "#f098b2",
          },
          {
            key: "5",
            subtest: "Situational Judgement",
            score: "Band -",
            type: "sr",
            pr: 0,
            data: [],
            packageScore: [],
            color: "#f098b2",
          },
        ]);
        let score =
          (await res.data.scores?.length) > 0
            ? Object.values(res.data.scores)
            : [];
        score = await score?.map((i: any) => {
          return JSON.parse(i);
        });

        let mineData =
          (await res.data.mine?.length) > 0 ? res.data.mine[0] : [];
        mineData = (await mineData?.length) > 0 ? JSON.parse(mineData) : [];
        await setMine(mineData);

        const predicated: PredicatedDataType[] = await predicatedData;
        for (let i = 0; i < mine?.length; i++) {
          const percentage = await ((mine[i] * 100) / 44).toFixed(0);
          predicated[i].pr = percentage;
          predicated[i].color =
            percentage >= 90
              ? "#97dbbb"
              : percentage < 90 && percentage >= 70
                ? "#ffb67f"
                : "#f098b2";
        }

        if (score && score?.length > 0) {
          // calculate rank
          let usersRankScores: number[] = []
          usersRankScores = await score?.map((i: any) => {
            let userTotal = 0
            i?.map((value: any) => {
              userTotal += Number(value)
            })
            return userTotal
          })
          await usersRankScores.sort(function (a, b) { return b - a })
          let mineTotalScore = 0
          await mineData?.map((i: any) => mineTotalScore += i)

          const totalUser = usersRankScores
          usersRankScores = await usersRankScores.filter(function (item, index, inputArray) {
            return inputArray.indexOf(item) == index;
          });

          const rank = await usersRankScores?.findIndex((i) => i == mineTotalScore)
          setRank((rank + 1))

          //what percentage of people you did better than.
          const lessScore =
            mineData?.length > 0
              ? totalUser?.filter((i) => i < mineTotalScore)
              : [];
          const percentage: number | string = await (
            (lessScore?.length * 100) /
            totalUser?.length
          ).toFixed(0);

          setPrOfBetterPerformed(percentage)

          //Relative Performance chart calculation
          for (let i = 0; i < predicatedData?.length; i++) {
            const filterScrore = await score?.map((value: any) => {
              return value[i];
            });
            const userTotal: number[] = [];
            await userTotal.push(
              filterScrore?.filter((value) => value >= 0 && value <= 11)?.length
            );
            await userTotal.push(
              filterScrore?.filter((value) => value > 11 && value <= 22)?.length
            );
            await userTotal.push(
              filterScrore?.filter((value) => value > 22 && value <= 33)?.length
            );
            await userTotal.push(
              filterScrore?.filter((value) => value > 33 && value <= 44)?.length
            );
            predicated[i].data = userTotal;
            predicated[i].packageScore = filterScrore;
          }
        }

        await setPredicatedData(predicated);
      }
      await setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  }

  useEffect(() => {
    async function calculate() {
      if (Object.keys(mockData)?.length > 0 && scoreTable?.length > 0) {
        const sections = mockData?.sections;
        const result = await sections?.reduce((acc, item) => {
          acc[item.type] = item.total_score;
          return acc;
        }, {});
        const scores = await calculateScores([
          result["VR"],
          result["QR"],
          result["AR"],
          result["DM"],
        ]);
        const sjtScore = result["SJ"];
        let tempPredicatedData = await predicatedData;
        let total = 0
        tempPredicatedData = await predicatedData?.map((predicatedD) => {
          if (predicatedD.type === "vr") {
            predicatedD.score = String(scores[0]);
            total += scores[0]
          } else if (predicatedD.type === "qr") {
            predicatedD.score = String(scores[2]);
            total += scores[2]
          } else if (predicatedD.type === "ar") {
            predicatedD.score = String(scores[3]);
            total += scores[3]
          } else if (predicatedD.type === "dm") {
            predicatedD.score = String(scores[1]);
            total += scores[1]
          } else if (predicatedD.type === "sr") {
            predicatedD.score = "Band " + String(determineSJTband(sjtScore));
          }
          return predicatedD;
        });
        await setTotalScaledScore(total)
        await setPredicatedData(tempPredicatedData);
        await setScoreTableKey((preV) => preV + 10);
        await getPackageData(mockData.package.id);
      }
    }
    calculate()
  }, [mockData, scoreTable])

  async function getMockData() {
    try {
      await setLoading(true);
      await setMockData([]);
      const res = await getSessionDetail(mockId);
      await setScoreTable(res.data?.config?.score)
      await setSjtBands(res.data?.config?.rank)
      await setUcatPercentile(res.data.config.ucat_percentile)

      if (res.data) {
        await setMockData(res.data);
      }
      const filteredSubtests = await predicatedData?.filter(subtest =>
        res.data?.sections?.some(section => section?.name === subtest.subtest)
      );
      setPredicatedData(filteredSubtests)
    } catch (error) {
      setLoading(false);
    }
  }

  const columns: TableProps<VerbalDataType>["columns"] = [
    {
      title: "Questions",
      dataIndex: "questions",
      key: "questions",
      render: (text) => <a onClick={() => handleClick()}>{text}</a>,
    },
    {
      title: "Correct",
      dataIndex: "correct",
      key: "correct",
      render: (text) => <a onClick={() => handleClick()}>{text}</a>,
    },
    {
      title: "Partially Correct",
      dataIndex: "partially_correct",
      key: "partially_correct",
      render: (text) => <a onClick={() => handleClick()}>{text}</a>,
    },
    {
      title: "Incorrect",
      dataIndex: "incorrect",
      key: "incorrect",
      render: (text) => <a onClick={() => handleClick()}>{text}</a>,
    },
  ];

  const handleClick = () => {
    window.open(
      `${EXAM_APP_URL}/?session_id=${mockId}`,
      "_blank",
      "noreferrer"
    );
    // Perform your desired action here
  };

  return (
    <div className="performance-tab">
      <Select
        placeholder="Select"
        style={{ width: 328 }}
        value={mockId}
        onChange={(e) => setMockId(e)}
      >
        {mocks?.map((item, index) => (
          <Select.Option key={index} value={item.id}>
            {item?.package?.name} - (
            {moment(item?.started_at).format("MMMM Do YYYY hh:mm A")})
          </Select.Option>
        ))}
      </Select>
      {mockId && (
        <div className="completed-mocks">
          <div className="results">
            <div
              className="back-header"
              onClick={() => setActiveTab("Simulate")}
            >
              <ArrowLeftOutlined />
              <span>Completed Mocks</span>
            </div>
            <span className="title">{mockData?.package?.name}</span>

            {mockData?.sections?.map((item: any, index: number) => {
              const totalQuestions = item?.questions?.length;
              let correctAnswers = 0;
              let partiallyCorrectAnswers = 0;
              let incorrect = 0;
              item.questions.forEach((question: any) => {
                if (
                  (question.score == 1 && question.type == "MC") ||
                  question.score == 2
                ) {
                  correctAnswers++;
                } else if (question.score == 1 && question.type == "DD") {
                  partiallyCorrectAnswers++;
                } else if (question.score == 0) {
                  incorrect++;
                }
              });
              return (
                <div className="question-item" key={`${index}_${item.id}`}>
                  <span className="question-title">{item?.name}</span>
                  <div className="progress-bar">
                    <span
                      className="green"
                      style={{
                        width: `${(100 * correctAnswers) / totalQuestions}%`,
                      }}
                    ></span>
                    <span
                      className="orange"
                      style={{
                        width: `${(100 * partiallyCorrectAnswers) / totalQuestions
                          }%`,
                      }}
                    ></span>
                    <span
                      className="red"
                      style={{
                        width: `${(100 * incorrect) / totalQuestions}%`,
                      }}
                    ></span>
                  </div>
                  <Table
                    columns={columns}
                    dataSource={[
                      {
                        key: "1",
                        questions: `${totalQuestions} questions`,
                        correct: `${correctAnswers} correct`,
                        partially_correct: `${partiallyCorrectAnswers} partially correct`,
                        incorrect: `${incorrect} incorrect`,
                      },
                    ]}
                    pagination={false}
                    bordered
                    footer={() => {
                      return (
                        <div className="footer-table">
                          <span className="footer-label">{item?.name}</span>
                          <div className="footer-value">
                            {item?.questions?.map(
                              (question: any, _index: number) => (
                                <div
                                  key={`${mockData?.package?.id}_${_index}`}
                                  className={`value ${question.score === 2 ||
                                    (question.type === "MC" &&
                                      question.score === 1)
                                    ? "green"
                                    : question.type === "DD" &&
                                      question.score === 1
                                      ? "orange"
                                      : "red"
                                    }`}
                                  style={{
                                    backgroundColor:
                                      question.score === 2 ||
                                        (question.type === "MC" &&
                                          question.score === 1)
                                        ? "#a8e2c8"
                                        : question.type === "DD" &&
                                          question.score === 1
                                          ? "#f7c2a0"
                                          : "#eda2bf",
                                  }}
                                  onClick={() =>
                                    window.open(
                                      `${EXAM_APP_URL}/?session_id=${mockId}&question_id=${question?.id}`,
                                      "_blank",
                                      "noreferrer"
                                    )
                                  }
                                >
                                  {question?.duration}s
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      );
                    }}
                  />
                </div>
              );
            })}
          </div>

          <div className="predicated">
            {/* UCAT Percentile */}
            {(mockData?.completed === 1 || mockData?.completed === '1' || mockData?.completed === true) &&
              <div className="ucat-pr">
                <div className="label-container">
                  <span className="predicated-ucat-label">UCAT Percentile</span>
                </div>
                <div className="ucat-label">
                  <span>The MissionMed cohort percentile is only valid at the end of the exam period of which you will be notified.</span>
                </div>

                <div className="tip-label" >
                  <span>Relative to MissionMed Cohort</span>
                  <Tooltip placement="rightTop" title="This is a percentile calculated relative to the rest of the MissionMed cohort. It represents what percentage of people you did better than.">
                    <QuestionCircleFilled />
                  </Tooltip>
                </div>
                <div className="value" >
                  <span>Rank {rank}</span>
                  {/* <div className="divider" />
                  <span>{prOfBetterPerformed}%tile</span> */}
                </div>

                <div className="tip-label" >
                  <span>Total Cognitive Scaled Score</span>
                  <Tooltip placement="rightTop" title="This is the total sum of you individual scaled sub-test scores.">
                    <QuestionCircleFilled />
                  </Tooltip>
                </div>
                <div className="value" >
                  <span>{totalScaledScore}</span>
                </div>

                <div className="tip-label" >
                  <span>Relative to {moment().subtract('year', 1).format('yyyy')} UCAT Cohort</span>
                  <Tooltip placement="rightTop" title="This is a percentile calculated from what you would have received in last year’s percentile conversion based on your UCAT scaled score.">
                    <QuestionCircleFilled />
                  </Tooltip>
                </div>
                <div className="value" >
                  <span>{UCATPR}%tile</span>
                </div>

                <div>
                  <Button icon={<SignalFilled />} onClick={() => window.open('http://missionmed.com.au/learn/', '_blank')} >Uni-specific UCAT Thresholds</Button>
                </div>
              </div>
            }

            {/* predicated scores */}
            <div className="label-container">
              <span className="predicated-label">Predicted Scores</span>
            </div>
            <div className="container">
              <Table
                key={scoreTableKey}
                columns={PredicatedColumns}
                dataSource={predicatedData}
                pagination={false}
                bordered
              />
              {loading ? (
                <Spin />
              ) : (
                <>
                  <div className="label-container" style={{ marginTop: "16px" }}>
                    <span className="predicated-label">Relative Performance</span>
                    <span style={{ display: "block" }}>This will only be accurate after the exam period is finished.</span>
                  </div>
                  <div className="chart-container">
                    {predicatedData?.map((item, index) => {
                      const total = item?.packageScore?.length;
                      const lessScore =
                        mine?.length > 0
                          ? item?.packageScore?.filter((i) => i < mine[index])
                          : [];
                      const percentage: number | string = (
                        (lessScore?.length * 100) /
                        total
                      ).toFixed(0);
                      return (
                        <div className="chart-item" key={index}>
                          <div className="chart-heading">
                            <span className="chart-label">{item.subtest}</span>
                            <span className="">{`You performed better than ${percentage}% of the cohort.`}</span>
                          </div>
                          {item?.data && item?.data?.length > 0 && (
                            <LineChart
                              key={`${index}_${mockId}`}
                              xAxis={[
                                {
                                  data: [0, 11, 22, 33, 44],
                                  label: "Score",
                                  valueFormatter: (value, context) =>
                                    value >= 0 &&
                                      value <= 11 &&
                                      context.location === "tooltip"
                                      ? "0 - 11"
                                      : value >= 12 &&
                                        value <= 22 &&
                                        context.location === "tooltip"
                                        ? "12 - 22"
                                        : value >= 23 &&
                                          value <= 33 &&
                                          context.location === "tooltip"
                                          ? "23 - 33"
                                          : value >= 34 &&
                                            value <= 44 &&
                                            context.location === "tooltip"
                                            ? "34 - 44"
                                            : String(value),
                                },
                              ]}
                              yAxis={[
                                {
                                  data: item?.data?.map((i, index) => {
                                    return index + 1;
                                  }),
                                  label: "Student",
                                },
                              ]}
                              series={[
                                {
                                  data: item.data,
                                  area: true,
                                  showMark: false,
                                  color:
                                    percentage >= 90
                                      ? "#97dbbb"
                                      : percentage < 90 && percentage >= 70
                                        ? "#ffb67f"
                                        : "#f098b2",
                                },
                              ]}
                              height={180}
                            >
                              <ChartsReferenceLine
                                x={mine?.length > 0 ? mine[index] : 0}
                                lineStyle={{
                                  strokeWidth: 1.9,
                                  stroke:
                                    percentage >= 90
                                      ? "#97dbbb"
                                      : percentage < 90 && percentage >= 70
                                        ? "#ffb67f"
                                        : "#f098b2",
                                }}
                                labelStyle={{
                                  fontSize: "10",
                                  fill:
                                    percentage >= 90
                                      ? "#97dbbb"
                                      : percentage < 90 && percentage >= 70
                                        ? "#ffb67f"
                                        : "#f098b2",
                                }}
                                label={`${mine?.length > 0 ? mine[index] : ""}`}
                                labelAlign="start"
                                classes={{
                                  line: "chart-line",
                                  label: "line-label",
                                }}
                              />
                            </LineChart>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
            {mockData?.sections && (
              <div className="label-container">
                <span className="predicated-label">Timing Statistics</span>
              </div>
            )}
            {mockData?.sections?.map((item: any, index: number) => {
              const correct = item?.questions?.filter(
                (i: any) => i.score === 2 || (i.type === "MC" && i.score === 1)
              );
              const partially_correct = item?.questions?.filter(
                (i: any) => i.type === "DD" && i.score === 1
              );
              const incorrect = item?.questions?.filter(
                (i: any) => i?.score === 0
              );

              return (
                <div className="bar-chart" key={index}>
                  <span className="chart-label">{item?.name}</span>
                  <BarChart
                    series={[
                      // { data: item?.questions?.map((i: any) => { return i?.duration }), }
                      {
                        data: correct?.map((i: any) => {
                          return i?.duration;
                        }),
                        label: "Correct",
                      },
                      {
                        data: partially_correct?.map((i: any) => {
                          return i?.duration;
                        }),
                        label: "Partially Correct",
                      },
                      {
                        data: incorrect?.map((i: any) => {
                          return i?.duration;
                        }),
                        label: "Incorrect",
                      },
                    ]}
                    height={200}
                    yAxis={[
                      {
                        data: item?.questions?.map((i: any) => {
                          return i?.duration;
                        }),
                      },
                    ]}
                    xAxis={[
                      {
                        data: item?.questions?.map((i: any, index: number) => {
                          return index;
                        }),
                        scaleType: "band",
                      },
                    ]}
                    colors={["#a8e2c8", "#f7c2a0", "#eda2bf"]}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default Performance;
