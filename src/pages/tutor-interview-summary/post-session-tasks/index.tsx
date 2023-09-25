import { Button} from "antd"

const Postsessiontasks = () => {
  return (
    <>
      <div className={"post-session-tasks con-box"} style={{margin:"40px 0"}}>
        <h2 className={"secondary-title"}>Post-Session Tasks</h2>
        <div className={"con-box-wrap"}>
          <ul className={'list-disc'} style={{marginBottom:32}}>
            <li>Ask about how tutor was able to mentally reach the answer for Q34 in Mock 2 of Medify.</li>
            <li>Ask tutor to explain how to work through syllogisms.</li>
          </ul>
          <Button className={"secondary-button"}>Add New Task</Button>
        </div>
      </div>   
    </>
  )
}

export default Postsessiontasks
