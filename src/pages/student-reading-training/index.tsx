import "./index.less";
import React, {useEffect, useState} from "react";
import Section from "../../components/shared-ui/Section";
import { HomeOutlined, DownOutlined,QuestionCircleFilled } from "@ant-design/icons";
import { Breadcrumb, message, Space, Menu, Dropdown, Button, Empty, Typography, Card, Tag, Form, Row, Radio, Tabs } from "antd";
import CommonService from "../../api/services/Common";
import UnderConstructionPage from '../under-construction-page'

const StudentReadingTraining = () => {

    const { Text } = Typography;
    const [themeList, setThemeList] = useState([]);
    const [textComplexityList, setTextComplexityList] = useState([]);
    const [theme, setTheme] = useState();
    const [textComplexity, setTextComplexity] = useState();
    const [story, setStory] = useState();
    const [numWordsInText, setNumWordsInText] = useState(0);
    const [wpm, setWpm] = useState(0);
    const [isRead, setIsRead] = useState(false);
    const [isSubmit, setIsSubmit] = useState(false);
    const [score, setScore] = useState();
    const [training, setTraining] = useState();
    const [form] = Form.useForm();
    const { TabPane } = Tabs;
    const constuction = true;

    const handleThemeClick = (e : any) => {
        const selectedOption = themeList.find(theme => theme.key === e.key);
        setTheme(selectedOption)
        setIsSubmit(false)
    };


    const handleTextComplexityClick = (e : any) => {
        const selectedOption = textComplexityList.find(textComplexity => textComplexity.key === e.key);
        setTextComplexity(selectedOption);
        setIsSubmit(false)
    };
        
    useEffect(() => {
        getTrainingData();
    }, []);


    const getTrainingData = async () => {
        try {
            const response =  await CommonService.getAPI("/student/reading-trainer");
            if (response.data.success) {
                const themes = response.data.data.theme.map(theme => ({
                    label: theme.name,
                    key: theme.id.toString()
                }));
                setThemeList(themes);
                const textComplexitylevel = response.data.data.textComplexitylevel.map(level => ({
                    label: level.name,
                    key: level.id.toString()
                }));
                setTextComplexityList(textComplexitylevel)
            } else {
              throw new Error(response.data.message);
            }
          } catch (e) {
            message.error(e.message);
          }
    }

    useEffect(() => {
        if(theme && textComplexity) {
            getStory();
        }
    }, [theme, textComplexity]);

    const getStory = async () => {
        try {
            const data = {
                'theme' : theme?.key,
                'textComplexitylevel' : textComplexity?.key
            }
            const response = await CommonService.postAPI("/student/student-story",data);
            if (response.data.success) {
                if(!response.data.data) {
                    message.error('No story Found.');
                } 
                setStory(response.data.data)
                setWpm(0)
                setNumWordsInText(0)
            } else {
              throw new Error(response.data.message);
            }
          } catch (e) {
            message.error(e.message);
          }
    }
    
    const menu = (
        <Menu onClick={handleThemeClick} items={themeList}/>
    );

    const textOptions = (
        <Menu onClick={handleTextComplexityClick} items={textComplexityList}/>
    );
    
    useEffect(() => {
        let timer;
        if(story?.content && !isRead) {
            const text = story?.content
            const wordsArray = text.split(" ");
            setNumWordsInText(wordsArray.length);
        
            const startTime = new Date().getTime();
            const updateWPM = () => {
              const currentTime = new Date().getTime();
              let calculatedWpm = (currentTime - startTime) / 1000;
              calculatedWpm = wordsArray.length / calculatedWpm;
              calculatedWpm *= 60;
              if (calculatedWpm < 50000) {
                console.log("te",isRead);
                setWpm(prevWpm => {
                    const roundedWpm = calculatedWpm.toFixed(0);
                    if (roundedWpm !== prevWpm) {
                      return roundedWpm;
                    }
                    return prevWpm;
                });
              }
              timer = setTimeout(updateWPM, 500);
            };
            updateWPM();
        }

        return () => {
            clearTimeout(timer);
        };
      }, [numWordsInText,story, isRead]);

    const handleReading = async () => {
        try {
            const data = {
                'story' : story?.id,
                'wpm' : wpm
            }
            const response =  await CommonService.postAPI("/student/story-reading",data);
            if (response.data.success) {
                setTraining(response.data.data)
                setIsRead(true)
            } else {
                throw new Error(response.data.message);
            }
            } catch (e) {
            message.error(e.message);
        }
    }

    const handleSubmitAnswer = async (data) => {
        setIsSubmit(true)
        const correctAnswers = Object.values(data).filter(answer => answer.is_correct === 1);
        const total = Math.round((correctAnswers.length / story?.total_questions) * 100) 
        setScore(total)
        const payload = Object.values(data).map(answer => ({
            'training_id': training?.id,
            'question_id': answer.question_id,
            'answer_id': answer.id,
            'is_correct': answer.is_correct
        }));
        try {
            const data = {
                'training_id' : training?.id,
                'answers' : payload,
                'score' : total,
            }
            const response = await CommonService.postAPI("/student/save-answers",data);
            if (response.data.success) {
                setIsRead(true)
            } else {
                throw new Error(response.data.message);
            }
        } catch (e) {
            message.error(e.message);
        }
        
    };

    const handleCancel = () => {
        setIsSubmit(false)
        setIsRead(false)
        setStory(undefined)
        setTheme(undefined)
        setTextComplexity(undefined)
        form.resetFields();
    }

    const handleRestart = () => {
        setIsSubmit(false)
        setIsRead(false)
        setScore(0)
        form.resetFields();
    }

    const QuestionForm = () => {
        return <Form
                    form={form}
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    initialValues={{ remember: true }}
                    onFinish={handleSubmitAnswer}
                    layout="vertical"
                    autoComplete="off"
                >
                    {story?.questions.map((question, i) => (
                    <Form.Item label={ i+1 + '. '+ question.question} name={`question_${i}`}>
                        <Radio.Group 
                        className="radio_buttons"
                        style={{ width: "100%" }}
                        >
                        {question?.answers.map((answer, j) => (
                            <>
                            <Row>
                                <Radio value={answer} disabled={isSubmit} name={`question_${i}`}>{String.fromCharCode(65 + j)} {') '} {answer.answer}</Radio>
                            </Row>
                            {isSubmit &&
                                <>
                                {(answer?.is_correct || form.getFieldValue(`question_${i}`) == answer )  && 
                                    <Tag color={answer.is_correct ? 'green' : 'red'} className="ml_1">
                                        {answer.is_correct ? 'Correct: ' : 'Incorrect: '} {answer.reason}
                                    </Tag>
                                }
                                </>
                            }
                            </>
                        ))}
                        </Radio.Group>
                    </Form.Item>
                    ))}

                </Form>
    }
    
    return (
        <React.Fragment>
        <Section className={"application-review-section"}>
            <Breadcrumb>
            <Breadcrumb.Item href={"/"}>
                <HomeOutlined />
            </Breadcrumb.Item>
            <Breadcrumb.Item>Speed Reading Trainer</Breadcrumb.Item>
            </Breadcrumb>
            {constuction ? 
                <UnderConstructionPage />
            :
            <div className={"con-section-wrap tutor-mock-section-wrap"}>
            <div
                style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                }}
            >
                <h2 className={"tab-title"}>Speed Reading Trainer</h2>
                <div className="d_flex_center">
                <div className={"tagLayout errorTagStYouyle"}>
                    <Button size="large" type="primary" className="stats-btn">See My Stats</Button>
                </div>
                </div>
            </div>
            
            
            <div className={"upcoming-session con-box"}>
            <h2 className={"secondary-title"}>Trainer Options <QuestionCircleFilled  style={{marginLeft:"8px"}} title="Speed Reading Trainer" /></h2>
                <div className="div-style">
                    <Dropdown overlay={menu} className='dropdown-menu option-dropdown-menu' disabled={isRead}>
                        <Button><Space>{theme ? theme?.label : 'Select Theme'}<DownOutlined /></Space></Button>
                    </Dropdown>

                    <Dropdown overlay={textOptions} className="option-dropdown-menu" disabled={isRead}>
                        <Button><Space>{textComplexity ? textComplexity?.label : 'Text Complexity Level'}<DownOutlined /></Space></Button>
                    </Dropdown>
                </div>
                {story ?
                <>
                
                {!isRead ?
                    <Card
                 className="cart_body"
                 title="Read the following text as quickly as you can..."
                 actions={[
                    <div className="d_flex">
                        <Text className="ml_1"><b  id="wpm1">{wpm}</b> Words / Minute</Text>
                        <div>
                            <Button className={"secondary-button mr_1"} onClick={handleCancel}>Cancel</Button>
                            <Button className={"primary-button"} htmlType="submit" onClick={handleReading} disabled={isRead}>Done Reading</Button>
                        </div>
                    </div>
                  ]}
                 >
                    <Text>{story?.content}</Text>
                </Card>
                :
                <Card
                 className="cart_body"
                 title="Answer these questions from pure recall to assess your comprehension..."
                 actions={[
                    <div className="d_flex">
                        <div className="ml_1 minute_accuracy">
                        <Text className="ml_1"><b  id="wpm1">{wpm}</b> Words / Minute</Text>
                        {isSubmit &&
                            <Text className="ml_1"><b  id="wpm1">{score}</b>% Comprehension Accuracy</Text>
                        }
                        </div>
                        <div>
                            {isSubmit && <Button className={"secondary-button mr_1"}  onClick={handleRestart}>Restart</Button> }
                            <Button className={"primary-button"} htmlType="submit" onClick={() => {form.submit()}} disabled={isSubmit}>Done Answering</Button>
                        </div>
                    </div>
                  ]}
                 >
                {isSubmit ?
                    <Tabs defaultActiveKey="2">
                        <TabPane tab="Comprehension Text" key="1">
                        {story?.content}
                        </TabPane>
                        <TabPane tab="Questions" key="2">
                            <QuestionForm />
                        </TabPane>
                    </Tabs> :
                    <QuestionForm />
                }
                    
                </Card>
                }
                </>
                :
                <div className={"con-box-wrap trainer_options"}>
                    <h2 className={"con-box-title"}>Select a theme and complexity to begin...</h2>
                    <div className="mock-interview">
                        <div className={"con-section-wrap"}>
                            <div className={"con-box"}>
                                <div
                                    className={"con-box-wrap"}
                                    style={{ textAlign: "center" }}
                                >
                                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={''}/>
                                    <h2 className={"con-box-title"}>
                                        <Text>Select a theme and complexity to start the trainer.</Text>
                                    </h2>
                                    <div style={{ marginBottom: "16px" }}>
                                        <Text>You will then be asked a series of questions. You must answer from memory.</Text>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                }
        </div>
            </div>
            }
        </Section>
        </React.Fragment>
    );
};

export default StudentReadingTraining;