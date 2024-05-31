import { Select, Spin, TableProps } from "antd";
import { Option } from "antd/lib/mentions";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Table } from 'antd';
import { Session } from './types';
import { LineChart } from '@mui/x-charts/LineChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { useEffect, useState } from "react";
import { getSessionDetail, getpackage } from "../../api/services/MockSimulation";
import { EXAM_APP_URL } from '../../config/app-config'
import moment from "moment";
import { ChartsReferenceLine } from '@mui/x-charts/ChartsReferenceLine';
interface VerbalDataType {
  key: string;
  questions: string;
  correct: string;
  partially_correct: string
  incorrect: string;
}

interface PredicatedDataType {
  key: string;
  subtest: string;
  score: string;
  type?: string;
  pr: number
  data: number[]
  packageScore: number[]
  color: string
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

const scoreTable: ScoreTable[] = [
  { estimatedScore: 300, vr: 0, qr: 0, ar: 0, dm: 0 },
  { estimatedScore: 330, vr: 6, qr: 4, ar: 5, dm: 4 },
  { estimatedScore: 350, vr: 8, qr: 6, ar: 7, dm: 5 },
  { estimatedScore: 380, vr: 9, qr: 8, ar: 9, dm: 6 },
  { estimatedScore: 400, vr: 11, qr: 10, ar: 11, dm: 7 },
  { estimatedScore: 430, vr: 12, qr: 12, ar: 12, dm: 8 },
  { estimatedScore: 450, vr: 14, qr: 14, ar: 14, dm: 9 },
  { estimatedScore: 480, vr: 15, qr: 16, ar: 16, dm: 10 },
  { estimatedScore: 500, vr: 17, qr: 17, ar: 18, dm: 11 },
  { estimatedScore: 530, vr: 18, qr: 18, ar: 20, dm: 12 },
  { estimatedScore: 550, vr: 20, qr: 19, ar: 22, dm: 13 },
  { estimatedScore: 580, vr: 21, qr: 20, ar: 23, dm: 14 },
  { estimatedScore: 600, vr: 23, qr: 21, ar: 25, dm: 15 },
  { estimatedScore: 630, vr: 24, qr: 22, ar: 27, dm: 16 },
  { estimatedScore: 650, vr: 26, qr: 23, ar: 29, dm: 17 },
  { estimatedScore: 680, vr: 27, qr: 24, ar: 31, dm: 18 },
  { estimatedScore: 700, vr: 29, qr: 25, ar: 32, dm: 19 },
  { estimatedScore: 730, vr: 30, qr: 26, ar: 34, dm: 20 },
  { estimatedScore: 750, vr: 32, qr: 27, ar: 36, dm: 21 },
  { estimatedScore: 780, vr: 33, qr: 28, ar: 38, dm: 22 },
  { estimatedScore: 800, vr: 35, qr: 29, ar: 41, dm: 23 },
  { estimatedScore: 830, vr: 36, qr: 30, ar: 43, dm: 24 },
  { estimatedScore: 850, vr: 38, qr: 31, ar: 44, dm: 25 },
  { estimatedScore: 880, vr: 39, qr: 32, ar: 45, dm: 26 },
  { estimatedScore: 900, vr: 41, qr: 33, ar: 47, dm: 27 }
];

const sjtBands: BandRange[] = [
  { band: 1, minScore: 56, maxScore: 66 },
  { band: 2, minScore: 37, maxScore: 55 },
  { band: 3, minScore: 17, maxScore: 36 },
  { band: 4, minScore: 0, maxScore: 16 }
];

function findEstimatedScore(rawScore: number, scoreType: keyof ScoreTable): number {
  for (let i = scoreTable.length - 1; i >= 0; i--) {
    if (rawScore >= scoreTable[i][scoreType]) {
      return scoreTable[i].estimatedScore;
    }
  }
  return 300; // return the lowest score if raw score is below the minimum in the table
}

function calculateScores(rawScores: [number, number, number, number]): [number, number, number, number] {
  const vrScore = findEstimatedScore(rawScores[0], 'vr');
  const qrScore = findEstimatedScore(rawScores[1], 'qr');
  const arScore = findEstimatedScore(rawScores[2], 'ar');
  const dmScore = findEstimatedScore(rawScores[3], 'dm');
  return [vrScore, dmScore, qrScore, arScore];
}

function determineSJTband(score: number): number {
  const foundBand = sjtBands.find(band => score >= band.minScore && score <= band.maxScore);
  if (!foundBand) {
    throw new Error('Invalid score: Score must be between 0 and 66.');
  }
  return foundBand.band;
}

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
  mocks: Array<Session>
  selectedMockId: number
  setActiveTab: any
}

function Performance({ mocks, selectedMockId, setActiveTab }: Props) {
  const [mockId, setMockId] = useState<number>(selectedMockId)
  const [mockData, setMockData] = useState<any>([])
  const [scoreTableKey, setScoreTableKey] = useState<number>(52)
  const [predicatedData, setPredicatedData] = useState<PredicatedDataType[]>([
    {
      key: "1",
      subtest: "Verbal Reasoning",
      score: "-",
      type: "vr",
      pr: 0,
      data: [],
      packageScore: [],
      color: '#f098b2'
    },
    {
      key: "2",
      subtest: "Decision Making",
      score: "-",
      type: "dm",
      pr: 0,
      data: [],
      packageScore: [],
      color: '#f098b2'
    },
    {
      key: "3",
      subtest: "Quantitative Reasoning",
      score: "-",
      type: "qr",
      pr: 0,
      data: [],
      packageScore: [],
      color: '#f098b2'
    },
    {
      key: "4",
      subtest: "Abstract Reasoning",
      score: "-",
      type: "ar",
      pr: 0,
      data: [],
      packageScore: [],
      color: '#f098b2'
    },
    {
      key: "5",
      subtest: "Situational Judgement",
      score: "Band -",
      type: 'sr',
      pr: 0,
      data: [],
      packageScore: [],
      color: '#f098b2'
    },
  ])
  const [mine, setMine] = useState<number[]>([])
  const [scores, setScores] = useState<number[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (selectedMockId) {
      setMockId(selectedMockId)
    }
  }, [selectedMockId])

  useEffect(() => {
    const init = async () => {
      await setScores([])
      await setMine([])
      await getMockData()
    }
    init()
  }, [mockId])

  async function getPackageData(id: any) {
    try {
      await setLoading(true)

      const res = await getpackage(id)
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
            color: '#f098b2'
          },
          {
            key: "2",
            subtest: "Decision Making",
            score: "-",
            type: "dm",
            pr: 0,
            data: [],
            packageScore: [],
            color: '#f098b2'
          },
          {
            key: "3",
            subtest: "Quantitative Reasoning",
            score: "-",
            type: "qr",
            pr: 0,
            data: [],
            packageScore: [],
            color: '#f098b2'
          },
          {
            key: "4",
            subtest: "Abstract Reasoning",
            score: "-",
            type: "ar",
            pr: 0,
            data: [],
            packageScore: [],
            color: '#f098b2'
          },
          {
            key: "5",
            subtest: "Situational Judgement",
            score: "Band -",
            type: 'sr',
            pr: 0,
            data: [],
            packageScore: [],
            color: '#f098b2'
          },
        ])
        let score = await res.data.scores?.length > 0 ? Object.values(res.data.scores) : []
        score = await score?.map((i: any) => { return JSON.parse(i) })

        let mineData = await res.data.mine?.length > 0 ? res.data.mine[0] : []
        mineData = await mineData?.length > 0 ? JSON.parse(mineData) : []
        await setMine(mineData)

        const predicated: PredicatedDataType[] = await predicatedData
        for (let i = 0; i < mine?.length; i++) {
          const percentage = await ((mine[i] * 100) / 44).toFixed(0)
          predicated[i].pr = percentage
          predicated[i].color = percentage >= 90 ? '#97dbbb' : percentage < 90 && percentage >= 70 ? '#ffb67f' : '#f098b2'
        }

        if (score && score?.length > 0) {
          for (let i = 0; i < predicatedData?.length; i++) {
            const filterScrore = await score?.map((value: any) => { return value[i] })
            const userTotal: number[] = []
            await userTotal.push(filterScrore?.filter(value => value >= 0 && value <= 11)?.length)
            await userTotal.push(filterScrore?.filter(value => value > 11 && value <= 22)?.length)
            await userTotal.push(filterScrore?.filter(value => value > 22 && value <= 33)?.length)
            await userTotal.push(filterScrore?.filter(value => value > 33 && value <= 44)?.length)
            predicated[i].data = userTotal
            predicated[i].packageScore = filterScrore
          }
        }

        await setPredicatedData(predicated)
      }
      await setLoading(false)
    } catch (e) {
      console.log(e)
      setLoading(false)
    }
  }

  async function getMockData() {
    try {
      await setLoading(true)
      await setMockData([])
      const res = await getSessionDetail(mockId)
      if (res.data) {
        await setMockData(res.data)
        const sections = res.data.sections
        const result = sections.reduce((acc, item) => {
          acc[item.type] = item.total_score;
          return acc;
        }, {});
        const scores = await calculateScores([result['VR'], result['QR'], result['AR'], result['DM']]);
        const sjtScore = result['SJ'];
        let tempPredicatedData = await predicatedData
        tempPredicatedData = await predicatedData?.map((predicatedD) => {
          if (predicatedD.type === 'vr') {
            predicatedD.score = String(scores[0])
          } else if (predicatedD.type === 'qr') {
            predicatedD.score = String(scores[1])
          } else if (predicatedD.type === 'ar') {
            predicatedD.score = String(scores[2])
          } else if (predicatedD.type === 'dm') {
            predicatedD.score = String(scores[3])
          } else if (predicatedD.type === 'sr') {
            predicatedD.score = 'Band ' + String(determineSJTband(sjtScore))
          }
          return predicatedD
        })
        await setPredicatedData(tempPredicatedData);
        await setScoreTableKey((preV) => preV + 10)
        await getPackageData(res.data.package.id)
      }
    } catch (error) {
      setLoading(false)
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
    window.open(`${EXAM_APP_URL}/?session_id=${mockId}`, "_blank", "noreferrer")
    // Perform your desired action here
  };

  return (
    <div className="performance-tab">
      <Select placeholder="Select"
        style={{ width: 328 }}
        value={mockId}
        onChange={(e) => setMockId(e)}
      >
        {mocks?.map((item, index) => (
          <Option key={index} value={item.id}  >{item?.package?.name} - ({moment(item?.started_at).format('MMMM Do YYYY hh:mm A')})</Option>
        ))}
      </Select>
      {mockId && (
        <div className="completed-mocks">
          <div className="results">
            <div className="back-header" onClick={() => setActiveTab('Simulate')} >
              <ArrowLeftOutlined />
              <span>Completed Mocks</span>
            </div>
            <span className="title">
              {mockData?.package?.name}
            </span>

            {mockData?.sections?.map((item: any, index: number) => {
              const totalQuestions = item?.questions?.length;
              let correctAnswers = 0;
              let partiallyCorrectAnswers = 0;
              let incorrect = 0;
              item.questions.forEach(question => {
                if ((question.score == 1 && question.type == "MC") || question.score == 2) {
                  correctAnswers++;
                } else if (question.score == 1 && question.type == "DD") {
                  partiallyCorrectAnswers++;
                } else if (question.score == 0) {
                  incorrect++;
                }
              });
              return (
                <div className="question-item" key={index} >
                  <span className="question-title">{item?.name}</span>
                  <div className="progress-bar">
                    <span className="green" style={{ width: `${(100 * correctAnswers) / totalQuestions}%` }}></span>
                    <span className="orange" style={{ width: `${(100 * partiallyCorrectAnswers) / totalQuestions}%` }}></span>
                    <span className="red" style={{ width: `${(100 * incorrect) / totalQuestions}%` }}></span>
                  </div>
                  <Table
                    columns={columns}
                    dataSource={[{
                      key: '1',
                      questions: `${totalQuestions} questions`,
                      correct: `${correctAnswers} correct`,
                      partially_correct: `${partiallyCorrectAnswers} partially correct`,
                      incorrect: `${incorrect} incorrect`
                    }]}
                    pagination={false}
                    bordered
                    footer={() => {
                      return (
                        <div className="footer-table">
                          <span className="footer-label">{item?.name}</span>
                          <div className="footer-value">
                            {item?.questions?.map((question: any, _index: number) => (
                              <div
                                key={mockData?.package?.id}
                                className={`value ${question.score === 2 || (question.type === 'MC' && question.score === 1) ? 'green' : question.type === 'DD' && question.score === 1 ? 'orange' : 'red'}`}
                                style={{ backgroundColor: question.score === 2 || (question.type === 'MC' && question.score === 1) ? '#a8e2c8' : question.type === 'DD' && question.score === 1 ? '#f7c2a0' : '#eda2bf' }}
                                onClick={() => window.open(`${EXAM_APP_URL}/?session_id=${mockId}&question_id=${question?.id}`, "_blank", "noreferrer")}
                              >
                                {question?.duration}s
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }}
                  />
                </div>
              )
            })}
          </div>

          {/* predicated scores */}
          <div className="predicated">
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
              {loading
                ?
                <Spin />
                :
                <div className="chart-container">
                  {predicatedData?.map((item, index) => {
                    const total = item?.packageScore?.length
                    const lessScore = mine?.length > 0 ? item?.packageScore?.filter(i => i < mine[index]) : []
                    const percentage: number | string = ((lessScore?.length * 100) / total).toFixed(0)
                    return (
                      <div className="chart-item" key={index}>
                        <div className="chart-heading" >
                          <span className="chart-label">{item.subtest}</span>
                          <span className="">{`You performed better than ${percentage}% of the cohort.`}</span>
                        </div>
                        {item?.data && item?.data?.length > 0 &&
                          <LineChart
                            key={`${index}_${mockId}`}
                            xAxis={[{
                              data: [0, 11, 22, 33, 44],
                              label: 'Score',
                              valueFormatter: (value, context) =>
                                value >= 0 && value <= 11 && context.location === 'tooltip'
                                  ? '0 - 11'
                                  : value >= 12 && value <= 22 && context.location === 'tooltip' ?
                                    '12 - 22'
                                    : value >= 23 && value <= 33 && context.location === 'tooltip' ?
                                      '23 - 33'
                                      : value >= 34 && value <= 44 && context.location === 'tooltip' ?
                                        '34 - 44'
                                        : String(value),
                            }]}
                            yAxis={[{ data: item?.data?.map((i, index) => { return index + 1 }), label: 'Student' }]}
                            series={[
                              {
                                data: item.data,
                                area: true,
                                showMark: false,
                                color: percentage >= 90 ? '#97dbbb' : percentage < 90 && percentage >= 70 ? '#ffb67f' : '#f098b2'
                              },
                            ]}
                            height={180}
                          >
                            <ChartsReferenceLine
                              x={mine?.length > 0 ? mine[index] : 0}
                              lineStyle={{ strokeWidth: 1.9, stroke: percentage >= 90 ? '#97dbbb' : percentage < 90 && percentage >= 70 ? '#ffb67f' : '#f098b2' }}
                              labelStyle={{ fontSize: '10', fill: percentage >= 90 ? '#97dbbb' : percentage < 90 && percentage >= 70 ? '#ffb67f' : '#f098b2' }}
                              label={`${mine?.length > 0 ? mine[index] : ''}`}
                              labelAlign="start"
                              classes={{ line: 'chart-line', label: 'line-label' }}
                            />
                          </LineChart>
                        }
                      </div>
                    )
                  })}
                </div>
              }
            </div>
            {mockData?.sections && (
              <div className="label-container">
                <span className="predicated-label">Timing Statistics</span>
              </div>)}
            {mockData?.sections?.map((item: any, index: number) => {
              const correct = item?.questions?.filter((i: any) => i.score === 2 || (i.type === 'MC' && i.score === 1))
              const partially_correct = item?.questions?.filter((i: any) => i.type === 'DD' && i.score === 1)
              const incorrect = item?.questions?.filter((i: any) => i?.score === 0)

              return (
                <div className="bar-chart" key={index}>
                  <span className="chart-label">{item?.name}</span>
                  <BarChart
                    series={[
                      // { data: item?.questions?.map((i: any) => { return i?.duration }), }
                      { data: correct?.map((i: any) => { return i?.duration }), label: 'Correct' }, { data: partially_correct?.map((i: any) => { return i?.duration }), label: 'Partially Correct' }, { data: incorrect?.map((i: any) => { return i?.duration }), label: 'Incorrect' }
                    ]}
                    height={200}
                    yAxis={[{ data: item?.questions?.map((i: any) => { return i?.duration }) }]}
                    xAxis={[{ data: item?.questions?.map((i: any, index: number) => { return index }), scaleType: 'band' }]}
                    colors={['#a8e2c8', '#f7c2a0', '#eda2bf']}
                  />
                </div>
              )
            })}

          </div>
        </div>
      )}

    </div>
  );
}

export default Performance;