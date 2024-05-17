import { Select, TableProps } from "antd";
import { Option } from "antd/lib/mentions";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Table } from 'antd';
import { Tiny, Column } from '@ant-design/plots';
import { Session } from './types';

interface VerbalDataType {
  key: string;
  questions: string;
  correct: string;
  incorrect: string;
}
const columns: TableProps<VerbalDataType>["columns"] = [
  {
    title: "Questions",
    dataIndex: "questions",
    key: "questions",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Correct",
    dataIndex: "correct",
    key: "correct",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Incorrect",
    dataIndex: "incorrect",
    key: "incorrect",
    render: (text) => <a>{text}</a>,
  },
];

interface DecisionDataType {
  key: string;
  questions: string;
  correct: string;
  partially_correct: string;
  incorrect: string;
}
const decisionColumns: TableProps<DecisionDataType>["columns"] = [
  {
    title: "Questions",
    dataIndex: "questions",
    key: "questions",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Correct",
    dataIndex: "correct",
    key: "correct",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Partially Correct",
    dataIndex: "partially_correct",
    key: "partially_correct",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Incorrect",
    dataIndex: "incorrect",
    key: "incorrect",
    render: (text) => <a>{text}</a>,
  },
];

interface PredicatedDataType {
  key: string;
  subtest: string;
  score: string;
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
  mockId: number
}

function Performance({ mocks, mockId }: Props) {

  const verbalData: VerbalDataType[] = [
    {
      key: '1',
      questions: '8 questions',
      correct: '7 correct',
      incorrect: '1 incorrect'
    },
  ];

  const partialData: DecisionDataType[] = [
    {
      key: "1",
      questions: "8 questions",
      correct: "7 correct",
      partially_correct: "1 partially correct",
      incorrect: "1 incorrect",
    },
  ];

  const predicatedData: PredicatedDataType[] = [
    {
      key: "1",
      subtest: "Verbal Reasoning",
      score: "850",
    },
    {
      key: "2",
      subtest: "Decision Making",
      score: "700-800",
    },
    {
      key: "3",
      subtest: "Quantitative Reasoning",
      score: "630",
    },
    {
      key: "4",
      subtest: "Abstract Reasoning",
      score: "670",
    },
    {
      key: "5",
      subtest: "Situational Judgement",
      score: "Brand 3",
    },
  ];

  const data = [
    100, 150, 350, 400, 450, 520, 600, 700, 900, 850, 750, 600, 520, 450, 320,
    200, 100,
  ].map((value, index) => ({ value, index }));

  const config = {
    data,
    width: 100,
    height: 80,
    padding: 8,
    shapeField: "smooth",
    xField: "index",
    yField: "value",
    style: {
      fill: "linear-gradient(-90deg, white 0%, darkgreen 100%)",
      fillOpacity: 0.6,
    },
  };

  const configBar = {
    data: [
      { letter: "A", frequency: 15 },
      { letter: "B", frequency: 0 },
      { letter: "C", frequency: 10 },
      { letter: "D", frequency: 35 },
      { letter: "E", frequency: 5 },
      { letter: "F", frequency: 20 },
    ],
    xField: "letter",
    yField: "frequency",
    height: 150,
    width: 300,
    scale: {
      x: { padding: 0.5 },
    },
    style: {
      maxWidth: 200,
    },
  };

  return (
    <div className="performance-tab">
      <Select placeholder="Select" style={{ width: 328 }} value={mockId}
        onChange={(e) => console.log(e)}
      >
        {mocks?.map((item, index) => (
          <Option key={index} value={item?.package?.id}  >{item?.package?.name}</Option>
        ))}
      </Select>

      <div className="completed-mocks">
        <div className="results">
          <div className="back-header">
            <ArrowLeftOutlined />
            <span>Completed Mocks</span>
          </div>
          <span className="title">
            UCAT Diagnostic Mock(30-minutes) Results
          </span>

          <div className="question-item">
            <span className="question-title">Verbal Reasoning Questions</span>
            <div className="progress-bar">
              <span className="green" style={{ width: "10%" }}></span>
              <span className="orange" style={{ width: "65%" }}></span>
              <span className="red" style={{ width: "25%" }}></span>
            </div>
            <Table
              columns={columns}
              dataSource={verbalData}
              pagination={false}
              bordered
              footer={() => {
                return (
                  <div className="footer-table">
                    <span className="footer-label">Verbal Reasoning</span>
                    <div className="footer-value">
                      {resion?.map((item, index) => (
                        <div
                          key={index}
                          className={`value ${item.flag}`}
                          style={{ backgroundColor: item.color }}
                        >
                          {item.value}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }}
            />
          </div>


          <div className="question-item">
            <span className="question-title">Decision Making Questions</span>
            <div className="progress-bar">
              <span className="green" style={{ width: "10%" }}></span>
              <span className="orange" style={{ width: "65%" }}></span>
              <span className="red" style={{ width: "25%" }}></span>
            </div>
            <Table
              columns={decisionColumns}
              dataSource={partialData}
              pagination={false}
              bordered
              footer={() => {
                return (
                  <div className="footer-table">
                    <span className="footer-label">Decision Reasoning</span>
                    <div className="footer-value">
                      {resion?.map((item, index) => (
                        <div
                          key={index}
                          className={`value ${item.flag}`}
                          style={{ backgroundColor: item.color }}
                        >
                          {item.value}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }}
            />
          </div>

          <div className="question-item">
            <span className="question-title">
              Quantitative Reasoning Questions
            </span>
            <div className="progress-bar">
              <span className="green" style={{ width: "30%" }}></span>
              <span className="orange" style={{ width: "45%" }}></span>
              <span className="red" style={{ width: "25%" }}></span>
            </div>
            <Table
              columns={columns}
              dataSource={verbalData}
              pagination={false}
              bordered
              footer={() => {
                return (
                  <div className="footer-table">
                    <span className="footer-label">Quantitative Reasoning</span>
                    <div className="footer-value">
                      {quantitative?.map((item, index) => (
                        <div
                          key={index}
                          className={`value ${item.flag}`}
                          style={{ backgroundColor: item.color }}
                        >
                          {item.value}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }}
            />
          </div>
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
                  <span className="chart-label">{item.subtest}</span>
                  <Tiny.Area {...config} theme={"classic"} />
                </div>
              ))}
            </div>
          </div>
          <div className="label-container">
            <span className="predicated-label">Timing Statistics</span>
          </div>
          <div className="bar-chart">
            <span className="chart-label">Verbal Reasoning</span>
            <Column {...configBar} theme={"classic"} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Performance;

const resion = [
  { value: "25s", color: "#a8e2c8", flag: "green" },
  { value: "15s", color: "#a8e2c8", flag: "green" },
  { value: "29s", color: "#a8e2c8", flag: "green" },
  { value: "32s", color: "#f7c2a0", flag: "orange" },
  { value: "25s", color: "#a8e2c8", flag: "green" },
  { value: "35s", color: "#a8e2c8", flag: "green" },
  { value: "22s", color: "#eda2bf", flag: "red" },
  { value: "43s", color: "#a8e2c8", flag: "green" },
  { value: "15s", color: "#a8e2c8", flag: "green" },
  { value: "29s", color: "#a8e2c8", flag: "green" },
  { value: "32s", color: "#f7c2a0", flag: "orange" },
  { value: "25s", color: "#a8e2c8", flag: "green" },
  { value: "35s", color: "#a8e2c8", flag: "green" },
  { value: "22s", color: "#eda2bf", flag: "red" },
  { value: "15s", color: "#a8e2c8", flag: "green" },
  { value: "29s", color: "#a8e2c8", flag: "green" },
  { value: "32s", color: "#f7c2a0", flag: "orange" },
  { value: "25s", color: "#a8e2c8", flag: "green" },
  { value: "35s", color: "#a8e2c8", flag: "green" },
  { value: "22s", color: "#eda2bf", flag: "red" },
];
const quantitative = [
  { value: "25s", color: "#a8e2c8", flag: "green" },
  { value: "15s", color: "#a8e2c8", flag: "green" },
  { value: "29s", color: "#a8e2c8", flag: "green" },
  { value: "32s", color: "#f7c2a0", flag: "orange" },
  { value: "25s", color: "#a8e2c8", flag: "green" },
  { value: "35s", color: "#a8e2c8", flag: "green" },
  { value: "22s", color: "#eda2bf", flag: "red" },
  { value: "42s", color: "#eda2bf", flag: "red" },
  { value: "43s", color: "#a8e2c8", flag: "green" },
  { value: "25s", color: "#a8e2c8", flag: "green" },
  { value: "25s", color: "#a8e2c8", flag: "green" },
  { value: "15s", color: "#a8e2c8", flag: "green" },
  { value: "29s", color: "#a8e2c8", flag: "green" },
  { value: "25s", color: "#a8e2c8", flag: "green" },
  { value: "15s", color: "#a8e2c8", flag: "green" },
  { value: "29s", color: "#a8e2c8", flag: "green" },
  { value: "25s", color: "#a8e2c8", flag: "green" },
  { value: "15s", color: "#a8e2c8", flag: "green" },
  { value: "25s", color: "#a8e2c8", flag: "green" },
  { value: "15s", color: "#a8e2c8", flag: "green" },
  { value: "29s", color: "#a8e2c8", flag: "green" },
  { value: "25s", color: "#a8e2c8", flag: "green" },
  { value: "15s", color: "#a8e2c8", flag: "green" },
  { value: "29s", color: "#a8e2c8", flag: "green" },
  { value: "25s", color: "#a8e2c8", flag: "green" },
  { value: "15s", color: "#a8e2c8", flag: "green" },
  { value: "29s", color: "#a8e2c8", flag: "green" },
  { value: "25s", color: "#a8e2c8", flag: "green" },
  { value: "15s", color: "#a8e2c8", flag: "green" },
  { value: "29s", color: "#a8e2c8", flag: "green" },
  { value: "25s", color: "#a8e2c8", flag: "green" },
  { value: "15s", color: "#a8e2c8", flag: "green" },
  { value: "29s", color: "#a8e2c8", flag: "green" },
  { value: "32s", color: "#f7c2a0", flag: "orange" },
  { value: "25s", color: "#a8e2c8", flag: "green" },
  { value: "35s", color: "#a8e2c8", flag: "green" },
  { value: "22s", color: "#eda2bf", flag: "red" },
  { value: "32s", color: "#f7c2a0", flag: "orange" },
  { value: "25s", color: "#a8e2c8", flag: "green" },
  { value: "35s", color: "#a8e2c8", flag: "green" },
  { value: "22s", color: "#eda2bf", flag: "red" },
  { value: "32s", color: "#f7c2a0", flag: "orange" },
  { value: "25s", color: "#a8e2c8", flag: "green" },
  { value: "35s", color: "#a8e2c8", flag: "green" },
  { value: "22s", color: "#eda2bf", flag: "red" },
  { value: "32s", color: "#f7c2a0", flag: "orange" },
  { value: "25s", color: "#a8e2c8", flag: "green" },
  { value: "35s", color: "#a8e2c8", flag: "green" },
  { value: "22s", color: "#eda2bf", flag: "red" },
];