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
  pr: number
}
const PredicatedColumns: TableProps<PredicatedDataType>["columns"] = [
  {
    title: "Subtest",
    dataIndex: "subtest",
    key: "subtest",
  },
  {
    title: "Medify Score",
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

  useEffect(() => {
    if (mockId)
      getMockData()
  }, [mockId])

  async function getMockData() {
    const res = await getSessionDetail(mockId)
    if (res.data) {
      setMockData(res.data)
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

  const predicatedData: PredicatedDataType[] = [
    {
      key: "1",
      subtest: "Verbal Reasoning",
      score: "850",
      pr: 18
    },
    {
      key: "2",
      subtest: "Decision Making",
      score: "700-800",
      pr: 17
    },
    {
      key: "3",
      subtest: "Quantitative Reasoning",
      score: "630",
      pr: 3
    },
    {
      key: "4",
      subtest: "Abstract Reasoning",
      score: "670",
      pr: 18
    },
    {
      key: "5",
      subtest: "Situational Judgement",
      score: "Brand 3",
      pr: -7
    },
  ];

  return (
    <div className="performance-tab">
      <Select placeholder="Select"
        style={{ width: 328 }}
        value={mockId}
        onChange={(e) => setMockId(e)}
      >
        {mocks?.map((item, index) => (
          <Option key={index} value={item.id}  >{item?.package?.name}</Option>
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
            const incorrect = (item?.questions?.length - item?.correct - item?.partially_correct)
            return (
              <div className="question-item" key={index} >
                <span className="question-title">{item?.name}</span>
                <div className="progress-bar">
                  <span className="green" style={{ width: `${(100 * item?.correct) / item?.questions?.length}%` }}></span>
                  <span className="orange" style={{ width: `${(100 * item?.partially_correct) / item?.questions?.length}%` }}></span>
                  <span className="red" style={{ width: `${(100 * incorrect) / item?.questions?.length}%` }}></span>
                </div>
                <Table
                  columns={columns}
                  dataSource={[{
                    key: '1',
                    questions: `${item?.questions?.length} questions`,
                    correct: `${item?.correct} correct`,
                    partially_correct: `${item?.partially_correct} partially correct`,
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
            <span className="predicated-label">Predicated Scores</span>
          </div>
          <div className="container">
            <Table
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