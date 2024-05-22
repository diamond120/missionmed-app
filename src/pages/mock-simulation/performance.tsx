import { Select, TableProps } from "antd";
import { Option } from "antd/lib/mentions";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Table } from 'antd';
import { Session } from './types';
import { LineChart } from '@mui/x-charts/LineChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { useEffect, useState } from "react";
import { getSessionDetail } from "../../api/services/MockSimulation";
import { EXAM_APP_URL } from '../../config/app-config'
import moment from "moment";

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
  const [mockData, setMockData] = useState<any>()
  const [scoreTableKey, setScoreTableKey] = useState<number>(52)
  const [predicatedData, setPredicatedData] = useState<PredicatedDataType[]>([
    {
      key: "1",
      subtest: "Verbal Reasoning",
      score: "-",
      type: "vr",
      pr: 18
    },
    {
      key: "2",
      subtest: "Decision Making",
      score: "-",
      type: "dm",
      pr: 17
    },
    {
      key: "3",
      subtest: "Quantitative Reasoning",
      score: "-",
      type: "qr",
      pr: 3
    },
    {
      key: "4",
      subtest: "Abstract Reasoning",
      score: "-",
      type: "ar",
      pr: 18
    },
    {
      key: "5",
      subtest: "Situational Judgement",
      score: "Band -",
      type: 'sr',
      pr: -7
    },
  ])

  useEffect(() => {
    if (mockId)
      getMockData()
  }, [mockId])

  async function getMockData() {
    const res = await getSessionDetail(mockId)
    if (res.data) {
      setMockData(res.data)
      const sections = res.data.sections
      const result = sections.reduce((acc, item) => {
          acc[item.type] = item.total_score;
          return acc;
      }, {});
      const scores = calculateScores([result['VR'], result['QR'], result['AR'], result['DM']]);
      const  sjtScore = result['SJ'];
      console.log(result,scores, sjtScore);
      let tempPredicatedData = predicatedData
      tempPredicatedData = predicatedData.map((predicatedD, index) => {
        if (predicatedD.type === 'vr') {
          predicatedD.score = String(scores[0])
        } else if (predicatedD.type === 'qr') {
          predicatedD.score = String(scores[1])
        } else if (predicatedD.type === 'ar') {
          predicatedD.score = String(scores[2])
        } else if(predicatedD.type === 'dm') {
          predicatedD.score = String(scores[3])
        } else if(predicatedD.type === 'sr') {
          predicatedD.score = 'Band '+String(determineSJTband(sjtScore))
        }
        return predicatedD
      })
      console.log(tempPredicatedData)
      setPredicatedData(tempPredicatedData);
      setScoreTableKey((preV) => preV + 10)
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
          <Option key={index} value={item.id}  >{item?.package?.name} - ({moment(item?.started_at).format('MMMM Do YYYY hh:mm A') })</Option>
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
              const correctAnswers = typeof item?.correct != "undefined" ? item?.correct : 0;
              const partiallyCorrectAnswers = typeof item?.partially_correct != "undefined" ? item?.partially_correct : 0;
              const totalQuestions = item?.questions?.length;
              const incorrect = (totalQuestions - correctAnswers - partiallyCorrectAnswers)
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
                              className={`value ${question?.score === 2 ? 'orange' : question?.score === 3 || question?.score === 1 ? 'green' : 'red'}`}
                              style={{ backgroundColor: question?.score === 2 ? '#f7c2a0' : question?.score === 3 || question?.score === 1 ? '#a8e2c8' : '#eda2bf' }}
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
            <div className="chart-container">
              {predicatedData?.map((item, index) => (
                <div className="chart-item" key={index}>
                  <span className="chart-label">{item.subtest} {item?.pr}%</span>
                  <LineChart
                    xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
                    series={[
                      {
                        data: [0, 5.5, 2, 8.5, 1.5, 5],
                        area: true,
                        showMark: false,
                        color: item?.pr > 0 && item?.pr <= 10 ? '#718dd2' : item?.pr > 10 ? '#62a593' : '#e58cab'
                      },
                    ]}
                    width={200}
                    height={175}
                    sx={{
                      '& .MuiMarkElement-root': {
                        strokeWidth: 1
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
          {mockData?.sections && (
            <div className="label-container">
              <span className="predicated-label">Timing Statistics</span>
            </div>)}
          {mockData?.sections?.map((item: any, index: number) => {
            const correct = item?.questions?.filter((i: any) => i?.score === 3 || i?.score === 1)
            const partially_correct = item?.questions?.filter((i: any) => i?.score === 2)
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