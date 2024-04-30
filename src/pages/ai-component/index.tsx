import "./index.less";
import React, {useEffect, useState} from "react";
import Section from "../../components/shared-ui/Section";
import { HomeOutlined, DownOutlined,QuestionCircleFilled } from "@ant-design/icons";
import { Breadcrumb, message, Space, Menu, Dropdown, Button, Empty, Typography, Card, Tag, Form, Row, Radio, Tabs } from "antd";
import CommonService from "../../api/services/Common";
import UnderConstructionPage from '../under-construction-page'
import { useNavigate } from "react-router-dom"
import { Loader } from "../../components/layout/Loader";
import wtf from "wtf_wikipedia";
import wtfPluginApi from "wtf-plugin-api";
import axios from "axios";
import posthog from "posthog-js";

const AIStory = () => {

    wtf.extend(wtfPluginApi);
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
      const [construction, setConstruction] = useState(null);
    const navigate = useNavigate()
    const [storyLoader, setStoryLoader] = useState(null)
    const [questionLoader, setQuestionLoader] = useState(null)
    const [retryCount, setRetryCount] = useState(0)
    const [questionList, setQuestionList] = useState(null)
    const [source, setSource] = useState(null);
    const [questionRetry, setQuestionRetry] = useState(0);
   

    const handleThemeClick = (e : any) => {
        const selectedOption = themeList.find(theme => theme.key == e.key);
        setTheme(selectedOption)
        setIsSubmit(false)
    };


    const handleTextComplexityClick = (e : any) => {
        const selectedOption = textComplexityList.find(textComplexity => textComplexity.key == e.key);
        setTextComplexity(selectedOption);
        setIsSubmit(false)
    };

    const getTrainingData = async () => {
        try {
            const response =  await CommonService.getAPI("/student/reading-trainer");
            if (response.data.success) {
                setConstruction(response.data.data.underConstruction)
                if(response.data.data.storyFeature != 1) {
                    navigate('/application_review')
                }
            } else {
                if(response.status_code == 401) {
                    navigate('/sign_in')
                }
            }
          } catch (e) {
            navigate('/sign_in')
          }
    }

    function truncateText(text, minWordCount) {
        const paragraphs = text.split("\n");
        let truncatedText = "";
        let wordCount = 0;
      
        for (const paragraph of paragraphs) {
          if (paragraph.trim() !== "") {
            const paragraphWords = paragraph.trim().split(/\s+/);
            const paragraphWordCount = paragraphWords.length;
      
            if (wordCount + paragraphWordCount <= minWordCount) {
              truncatedText += paragraph + "\n\n";
              wordCount += paragraphWordCount;
            } else {
              const sentences = paragraph.split(/(?<=[.!?])\s+/);
      
              let sentenceWordCount = 0;
              let sentenceIndex = 0;
      
              while (sentenceIndex < sentences.length) {
                const sentence = sentences[sentenceIndex];
                const sentenceWords = sentence.trim().split(/\s+/);
                 sentenceWordCount = sentenceWords.length;
      
                if (wordCount + sentenceWordCount <= minWordCount) {
                  truncatedText += sentence + " ";
                  wordCount += sentenceWordCount;
                  sentenceIndex++;
                } else {
                  truncatedText += sentence + "\n\n";
                  wordCount += sentenceWordCount;
                  break;
                }
              }
      
              break;
            }
          }
        }
      
        return truncatedText.trim();
      }
    
    async function fetchArticle(title) {
    const doc = await wtf.fetch(title);
    const sections = doc.sections().filter((section) => {
        const sectionTitle = section.title().toLowerCase();
        return sectionTitle !== "see also" && sectionTitle !== "external links";
    });
    const modifiedText = sections.map((section) => section.text()).join("\n\n");
    return modifiedText;
    }

    async function fetchCategoryArticles(categoryName, minWordCount) {
        let categoryPages = await wtf.getCategoryPages(categoryName);
        if(categoryPages.length > 0) {
          const newCatPage = [];
          newCatPage[0] = (categoryPages[0]);
          categoryPages = newCatPage;
        }
        
        const articleTexts = await Promise.all(
          categoryPages.map(async (page) => {
            if (page.ns === 0) {
              const text = await fetchArticle(page.title);
              const wordCount = text.trim().split(/\s+/).length;
              if (wordCount > minWordCount) {
                  return truncateText(text, minWordCount);
              }
            }
            return null;
          }),
        );
      
        return articleTexts.filter((text) => text !== null);
      }
      
      
    const getContentWikipedia = async (category) => {
        
        try {
            setQuestionList(null);
            setStoryLoader(true)
            const categoryName = category;
            const minWordCount = 800;
            await fetchCategoryArticles(categoryName, minWordCount)
            .then( async (articles) => {
            
            if(articles.length == 0 && retryCount  < 5) {
                getCategory();  
                setRetryCount(retryCount + 1);
            }
            if(articles.length == 0 && retryCount >= 5) {
                setStoryLoader(false)
                throw new Error('Something went wrong please try again later');
            }

            if(articles.length > 0) {
                  const data = { 'content' : articles };
                  setStory(data)
                  setStoryLoader(false)
                  getQuestion(articles)
                } 
            })
            
           
          } catch (e) {
            message.error(e.message);
            setStoryLoader(false)
          }
    }


    const getQuestion = async (articles : any) => {

        if (source) {
            source.cancel("Previous request canceled.");
        }
        const cancelToken = axios.CancelToken.source();
        setSource(cancelToken);
        setQuestionList(null);
        try {
            const payload = {
                'story' :  articles.toString()
            }
            const response = await CommonService.postAPI("/student/student-story",payload, cancelToken.token);
            
            if (response.data.success) {
                if(!response.data.data) {
                    message.error('No story Found.');
                }
                  try {
                    if(JSON.parse(response.data.data.question.replace(/^```json\s*|```$/g, ''))) {
                        setQuestionList(response.data.data.question)
                    }
                  } catch (error) {
                    setQuestionRetry(questionRetry + 1);
                    if(questionRetry  <= 5) {
                        getQuestion(articles)
                    } 
                    if(questionRetry > 5 ) {
                        throw new Error("Something went wrong. please try again letter.");
                    }
                  }
                
            } else {
                setQuestionList(null)
                throw new Error(response.data.message);
            }
          } catch (e) {
            setQuestionList(null)
            if (!axios.isCancel(error)) {
                // Handle non-cancelation errors
                console.error('Error:', error.message);
              }
            throw new Error(response.data.message);
          }
    }

    useEffect(() => {
        getTrainingData();
        getCategory();
        posthog.capture('Loading Story');
    }, []);

    async function getCategory() {
        await wtf.getRandomCategory().then(cat=>{
            cat = "Category:Archaeological sites in Bahrain";
            getContentWikipedia(cat);
        })
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
            const wordsArray = text.toString().split(" ");
            setNumWordsInText(wordsArray.length);
        
            const startTime = new Date().getTime();
            const updateWPM = () => {
              const currentTime = new Date().getTime();
              let calculatedWpm = (currentTime - startTime) / 1000;
              calculatedWpm = wordsArray.length / calculatedWpm;
              calculatedWpm *= 60;
              if (calculatedWpm < 50000) {
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
        posthog.capture('Done Reading');
        setIsRead(true)
    }

    const handleSubmitAnswer = async (data) => {
        posthog.capture('Submit Answers Of Story');
        setIsSubmit(true)

        const modify_submitted = JSON.parse(questionList.replace(/^```json\s*|```$/g, ''));
        let correctAnswers = 0;

        modify_submitted.questions.forEach((question, index) => {
                const selectedAnswer = data[`question_${index}`];
                if (selectedAnswer) {
                    question.answers.forEach(answer => {
                        if (
                            answer.option == selectedAnswer
                        ) {
                            if (answer.isCorrect == true) {
                                correctAnswers++;
                            }
                            answer.is_selected = true;
                        } else {
                            answer.is_selected = false;
                        }
                    });
                }
            });

        const total = Math.round((correctAnswers /  modify_submitted.questions.length) * 100) 
        setScore(total)
        setIsRead(true)
        
    };

    const handleCancel = () => {
        

        if (source) {
            source.cancel("Previous request canceled."); // Cancel previous request if source exists
        }      
        setIsSubmit(false)
        setIsRead(false)
        setStory(undefined)
        getCategory();
        // setQuestionLoader(true)
        setQuestionList(null);
        form.resetFields();
    }

    const handleRestart = () => {
        posthog.capture('Restart Story Reading');
        if (source) {
            source.cancel("Previous request canceled."); // Cancel previous request if source exists
        }      
        setStory(undefined)
        getCategory();
        setQuestionList(null);
        // setQuestionLoader(true)
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
                    className="reading_trainer"
                > 
                    {JSON.parse(questionList.replace(/^```json\s*|```$/g, '')).questions.map((question, i) => {
                      return  (
                    <Form.Item label={ i+1 + '. '+ question.question} name={`question_${i}`}  >
                        <Radio.Group 
                        className="radio_buttons"
                        style={{ width: "100%" }}
                        >
                        {question?.answers.map((answer, j) => (
                            <>
                            <Row>
                                <Radio value={answer.option} disabled={isSubmit}   name={`question_${i}`}>{String.fromCharCode(65 + j)} {') '} {answer.option}</Radio>
                            </Row>
                            {isSubmit &&
                                <>
                                {(answer?.isCorrect || form.getFieldValue(`question_${i}`) == answer.option )  && 
                                    <Tag color={answer.isCorrect ? 'green' : 'red'} className="ml_1">
                                        {answer.isCorrect ? 'Correct: ' : 'Incorrect: '} {answer.explanation}
                                    </Tag>
                                }
                                </>
                            }
                            </>
                        ))}
                        </Radio.Group>
                    </Form.Item>
                    )})}

                </Form>
    }
    
    if(construction == null) {                       
        return <div className="loader-wrap"> <Loader spinning size="large" className="loader-style"/></div>;
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
            {construction == true ? 
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
                {/* <div className={"tagLayout errorTagStYouyle"}>
                    <Button size="large" type="primary" className="stats-btn">See My Stats</Button>
                </div> */}
                </div>
            </div>
            
            
            <div className={"upcoming-session con-box"}>
            <h2 className={"secondary-title"}>Trainer Options 
            {/* <QuestionCircleFilled  style={{marginLeft:"8px"}} title="Speed Reading Trainer" /> */}
            </h2>
                {/* <div className="div-style">
                    <Dropdown overlay={menu} className='dropdown-menu option-dropdown-menu' disabled={isRead}>
                        <Button><Space>{theme ? theme?.label : 'Select Theme'}<DownOutlined /></Space></Button>
                    </Dropdown>

                    <Dropdown overlay={textOptions} className="option-dropdown-menu" disabled={isRead}>
                        <Button><Space>{textComplexity ? textComplexity?.label : 'Text Complexity Level'}<DownOutlined /></Space></Button>
                    </Dropdown>
                </div> */}
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
                            {/* <Button className={"secondary-button mr_1 cancel_btn"} onClick={handleCancel}>Cancel</Button> */}
                            <Button className={"secondary-button mr_1 cancel_btn"}  onClick={handleRestart}>Restart</Button>
                            <Button className={"primary-button"} htmlType="submit" onClick={handleReading} disabled={isRead}>Done Reading</Button>
                        </div>
                    </div>
                  ]}
                 >
                   <Text>
                        {story?.content.map((text) =>(
                            <p className="mt_2">{text}</p>
                        ))}
                    </Text>
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
                            {isSubmit && <Button className={"secondary-button mr_1 cancel_btn"}  onClick={handleCancel}>Restart</Button> }
                            <Button className={"primary-button"} htmlType="submit" onClick={() => {form.submit()}} disabled={isSubmit}>Done Answering</Button>
                        </div>
                    </div>
                  ]}
                 >
                {isSubmit ?
                    <Tabs defaultActiveKey="2">
                        <TabPane tab="Comprehension Text" key="1">
                       {story?.content.map((text) =>(
                            <p className="mt_2">{text}</p>
                        ))}
                        </TabPane>
                        <TabPane tab="Questions" key="2" >
                            <QuestionForm />
                        </TabPane>
                    </Tabs> :
                    
                   <>
                    {story == undefined || questionList == null &&
                        <Text  ><div className="loader-wrap"> <Loader spinning size="large" className="loader-style"/></div> </Text> }
                    {story != undefined && questionList != null  && <><QuestionForm /></> }
                   </>
                }
                    
                </Card>
                }
                </>
                :
                <div className={"con-box-wrap trainer_options"}>
                    {/* <h2 className={"con-box-title"}>Select a theme and complexity to begin...</h2> */}
                    <div className="mock-interview">
                        <div className={"con-section-wrap"}>
                            <div className={"con-box"}>
                                <div
                                    className={"con-box-wrap"}
                                    style={{ textAlign: "center" }}
                                >
                                    {storyLoader &&
                                    <Text  ><div className="loader-wrap"> <Loader spinning size="large" className="loader-style"/></div> </Text> }
                                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={''}/>
                                    {/* <h2 className={"con-box-title"}>
                                        <Text>Select a theme and complexity to start the trainer.</Text>
                                    </h2> */}
                                    <Text>You will then be asked a series of questions. You must answer from memory.</Text>
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

export default AIStory;
