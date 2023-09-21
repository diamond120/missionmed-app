import { Button } from 'antd';
import './index.less'
import { QuestionCircleFilled } from "@ant-design/icons";
import { useState } from 'react';

const Agenda = ({agenda, handleEditAgenda}) => {

  const [isEdit, setIsEdit] = useState(false);
  const handleClick = () => {
    setIsEdit(true)
    handleEditAgenda()
  }
  return (
    <>
      <div className={"upc-agenda con-box"}>
          <h2 className={"secondary-title"}>Agenda<QuestionCircleFilled  style={{marginLeft:"8px"}}/></h2>
          <div className={"con-box-wrap"}>
               <div style={{display:'flex',flexDirection:'column',alignItems:'start', justifyContent:'space-between',height:'100%'}}>
               <ul className={'list-disc'}>
                    {/* <li>Ask about how tutor was able to mentally reach the answer for Q34 in Mock 2 of Medify.</li>
                    <li>Ask tutor to explain how to work through syllogisms.</li> */}
                    {agenda}
               </ul>
               <Button className={"secondary-button"} onClick={handleClick}>Edit Agenda</Button>
               </div>
          </div>
      </div>
    </>
  )
}

export default Agenda
