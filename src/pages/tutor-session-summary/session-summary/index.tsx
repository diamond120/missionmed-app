import "./index.less"
import { Button, Form, Upload } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';



const Sessionsummary = () => {
  return (
    <>
      <div className={"session-summary con-box"}>
        <h2 className={"secondary-title"}>Session Summary </h2>
        <div className={"con-box-wrap"}>
          <ul style={{marginBottom:'24px'}}>
            <li>Here you can upload session summary.</li>
            <li>Supported file formats: PDF, DOC, DOCX</li>
          </ul>
          
          <div style={{marginBottom:"16px"}}><span style={{color:'#C92A2A'}}>*</span> Upload Session Summary <QuestionCircleOutlined style={{color:'#B5B9C9',fontSize:'14px',marginLeft:3}}/> :</div>
          <Form>
            <Form.Item valuePropName="fileList">
              <Upload action="/upload.do" className={"upload-file"}>
                <div>
                  <span className="upload-icon">
                    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                      <path d="M35.4934 14.9187L35.484 14.8812L30.2247 1.51719C29.9903 0.7625 29.2919 0.242188 28.4997 0.242188H7.18092C6.38404 0.242188 5.67623 0.771875 5.45123 1.53594L0.534043 14.7641L0.519981 14.7969L0.510605 14.8344C0.449668 15.0641 0.430918 15.2984 0.46373 15.5281C0.459043 15.6031 0.454355 15.6781 0.454355 15.7531V32.9047C0.455595 33.6602 0.75626 34.3844 1.29047 34.9186C1.82468 35.4528 2.54887 35.7534 3.30436 35.7547H32.7044C34.2747 35.7547 35.5544 34.475 35.559 32.9047V15.7531C35.559 15.6922 35.559 15.6312 35.5544 15.5797C35.5731 15.35 35.5544 15.1297 35.4934 14.9187ZM21.6278 12.9031L21.6137 13.6391C21.5762 15.7437 20.1231 17.1594 17.9997 17.1594C16.9637 17.1594 16.0731 16.8266 15.4309 16.1937C14.7887 15.5609 14.4372 14.6797 14.4184 13.6391L14.4044 12.9031H4.75748L8.48404 3.84219H27.1965L31.0262 12.9031H21.6278ZM4.04967 16.5031H11.4231C12.5622 19.1797 14.9856 20.7594 18.0044 20.7594C19.584 20.7594 21.0512 20.3187 22.2372 19.4844C23.2778 18.7531 24.0887 17.7312 24.6137 16.5031H31.9497V32.1547H4.04967V16.5031Z" fill="#2816EE"/>
                    </svg>
                  </span>

                  <div style={{ marginTop: 13,fontSize:'16px',color:'#312D42' }}>Click or drag file to this area to upload </div>
                  <div style={{  marginTop: 3,color: '#9096AE' }}>Support for a single or bulk upload.</div>
                </div>
              </Upload>
            </Form.Item>
            
            <Form.Item style={{marginBottom:0}}>
              <Button className={"secondary-button"}>Submit</Button>
            </Form.Item>

          </Form>

        </div>
      </div> 
          
    </>
  )
}

export default Sessionsummary
