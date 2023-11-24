import "./index.less"
import { Button, Form, Input, Spin, message } from "antd"
import { FC, useState } from "react"
import {useStudent, useStudentDispatch} from "../../../api/providers/StudentProvider";
import StudentService from "../../../api/services/Student";
import CommonService from "../../../api/services/Common";
import Cards from 'react-credit-cards';
import 'react-credit-cards/es/styles-compiled.css'
import {formatCreditCardNumber, formatCVC, formatExpirationDate} from "../../../common/common";

const CardDatails: FC<any> = ({props}) => {

  const student = useStudent();
  const dispatch = useStudentDispatch();
  const [form] = Form.useForm();
  const [userName, setUserName] = useState("");
  const [cvc, setCVC] = useState("");
  const [expiry, setExpiry] = useState("");
  const [number, setNumber] = useState("");
  const [ focused ,setFocused] = useState("");
  const [issuer , setIssuer] = useState();
  const [isCard , setIsCard] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleAddCard= () => {
    form.resetFields();
    setCVC("");
    setExpiry("");
    setNumber("");
    setExpiry("");
    setUserName("");
    setFocused("");
    setIsCard(!isCard);
  };

  const handleCallback = ({ issuer },isValid) => { 
    form.setFieldsValue({ issuer: issuer}); 
    if(isValid == true) {
      setIssuer(issuer);
      
    } else {
      setIssuer(issuer);
      console.log(isValid);
    }
  };

  const handleInputChange = async (event: any) => {
    if (event.target.name === 'number') {
      event.target.value = formatCreditCardNumber(event.target.value)
      form.setFieldsValue({ number: event.target.value});
      setNumber(event.target.value);
    } else if (event.target.name === 'expiry') {
      event.target.value = formatExpirationDate(event.target.value)
      form.setFieldsValue({ expiry: event.target.value});
      setExpiry(event.target.value);
    } else if (event.target.name === 'cvc') {
      event.target.value = formatCVC( event.target.value)
      form.setFieldsValue({ cvc: event.target.value});
      setCVC(event.target.value);
    } else 
    if (event.target.name === 'userName') {
      setUserName(event.target.value);
      form.setFieldsValue({ userName: event.target.value});
    }
    await form.validateFields();
  }

  const handleInputFocus = async (event: any) => {
    setFocused(event.target.name);
  }

  const handleSaveClick = async () => {
    setLoading(true);
    await form.validateFields();
    try{
    let formData = form.getFieldsValue(true);
    try{
        const response = await CommonService.postAPI('/student/add-card',formData);

        if(response.data.success){
         
            let card_digit = response.data.data.card_digit
            await StudentService.updateAppInfo({
                card_digit: card_digit !== '' ? card_digit : student?.card_digit,
            })
        
            dispatch({
              type:"update",
              student:{
                card_digit: card_digit !== '' ? card_digit : student?.card_digit,
              }
            })
            handleAddCard();
            setLoading(false);
            message.success('You’ve successfully added card');
        }else{
           setLoading(false);
            throw new Error(response.data.message)
        }
      }catch(e){
        setLoading(false);
        message.error(e.message);
      }
      handleAddCard()
    }catch(e){
      console.log(e);
      setLoading(false);
      return false;
    }
  };

  if(student?.loading){
    return(
      <Spin />
    )
  }
  
  return(
    <div className={"application-info-section"}>
      <h2 className={"application-info-section-title"}>Card  Details</h2>
        
        { (student.card_digit != null && student.card_digit != '' && isCard == true) && (
          <div className="credit-card">
            <div className="credit-card-header"> 
              <div className="card-brand">Card Number</div>

              <div className={"form-basic-button-wrap"}>
                <Button className={"form-button"} onClick={handleAddCard}>Edit</Button>
              </div>

              {/* <div className="chip primary-button" ><button  onClick={handleAddCard} >Edit</button></div> */}
            </div>
            <div className="credit-card-number">{'**** **** **** '+student.card_digit}</div>
          </div>
          )
        }
        { (student.card_digit == null || student.card_digit == '' || isCard == false) && (

        <Form className={"application-info-form"} form={form}>
        <Cards
              cvc={cvc}
              expiry={expiry}
              name={userName}
              number={number}
              focused={focused}
              callback={handleCallback}
            />  
              <Form.Item
                style={{ marginTop: "17px", marginBottom: "0px"}}
                label="Name"
                name={"userName"}
                rules={[{ required: true, message:"Please enter name" },
                      ]}
              > 
                <Input  className="form-control"  style={{ borderRadius: 8, fontSize: 16, lineHeight: 1.4, padding: " 8px 12px 8px 12px", }} id="messagsse"   name={"userName"}  onChange={handleInputChange}  onFocus={handleInputFocus}   placeholder={"Name"} />
              </Form.Item>

              <Form.Item
                key= "number"
                style={{ marginTop: "17px", marginBottom: "0px"}}
                label="Card Number"
                name={"number"}
                rules={[{ required: true, message:"Please enter card number" },
                        {
                          pattern:  /^[\d| ]{19,22}$/,
                          message: "Card number must be 16 to 22 digits long and may contain only numbers and spaces",
                        },
                ]}
              > 
                <Input style={{ borderRadius: 8, fontSize: 16, lineHeight: 1.4, padding: " 8px 12px 8px 12px", }}  name={"number"} onChange={handleInputChange} onFocus={handleInputFocus} placeholder={"Card Number"}  />
              </Form.Item>

              <Form.Item
                key= "expiry"
                style={{ marginTop: "17px", marginBottom: "0px"}}
                label="Expiration Date:"
                name={"expiry"}
                rules={[{ required: true, message:"Please enter expiry date" },
                      {
                        pattern: /\d\d\/\d\d/, // Regular expression pattern for MM/YY format
                        message: "Please enter a valid expiration date in MM/YY format",
                      },
                ]}
              
              > 
                <Input style={{ borderRadius: 8, fontSize: 16, lineHeight: 1.4, padding: " 8px 12px 8px 12px", }}  name={"expiry"} onChange={handleInputChange} onFocus={handleInputFocus} placeholder={"Valid Thru"} />
              </Form.Item>
              
              <Form.Item
                key= "cvc"
                style={{ marginTop: "17px", marginBottom: "0px"}}
                label="CVC:"
                name={"cvc"}
                rules={[{ required: true, message:"Please enter cvc" },
                        {
                          pattern:  /\d{3}/,
                        },
                      ]}
              
              > 
                <Input style={{ borderRadius: 8, fontSize: 16, lineHeight: 1.4, padding: " 8px 12px 8px 12px", }} name={"cvc"} onChange={handleInputChange} onFocus={handleInputFocus} placeholder={"CVC"}  />
              </Form.Item>

              <Form.Item
              name={"issuer"}
              initialValue={issuer} 
              >
                <Input type="hidden" name={'issuer'} value={issuer} />
              </Form.Item>
          
            {loading == true ? (
              <div className={"form-basic-button-wrap"}>
                <Spin />
              </div>
            ) : (
              <div className={"form-basic-button-wrap"}>
                <Button className={"form-button"} onClick={handleSaveClick}>Save</Button> &nbsp;
                <Button className={"form-button"} onClick={handleAddCard}>Cancel</Button>
              </div>
            )}

        </Form>
        )}
    </div>
  )
}
export default CardDatails