
import "./index.less"
import { Form, Input, Select, Switch, Button, AutoComplete } from "antd"
import { FC, useState } from "react"
import { useTimezoneSelect, allTimezones } from "react-timezone-select"
// import { useUpdateStudentMutation } from "../../../graphql"
import { AddressDetails } from "../../../types/AddressDetails"
import {useStudent, useStudentDispatch} from "../../../api/providers/StudentProvider";
import {default as StudentService} from "../../../api/services/Student";
import {GOOGLE_MAP_API_KEY} from "../../../config/app-config";

const { Option } = Select;

const BasicInfoForm: FC<any> = ({props}) => {
  const [form] = Form.useForm();
  const student = useStudent();
  const dispatch = useStudentDispatch();
  //const [ updateStudent ] = useUpdateStudentMutation()
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState<string | undefined | null>('')
  const [gender, setGender] = useState<string | undefined | null>('')
  const [pronouns, setPronouns] = useState<string | undefined | null>('')
  const [email, setEmail] = useState<string | undefined | null>('')
  const [birthday, setBirthday] = useState(student.birthday)
  const [phone, setPhone] = useState<string | undefined | null>(student?.phoneNumber)
  const [location, setLocation] = useState<string | undefined | null>(student?.location)
  const [state, setState] = useState<string | undefined | null>(student?.state)
  const [selectedTimezone, setSelectedTimezone] = useState<string | undefined | null>('')
  const [autoSelected, setAutoSelected] = useState<boolean>(false)
  const [autoSelectedLocation, setAutoSelectedLocation] = useState<string>('')
  const [autoSelectedState, setAutoSelectedState] = useState<string>('')

  const labelStyle = 'original'
  const timezones = {
    ...allTimezones,
  }

  const { options, parseTimezone } = useTimezoneSelect({ timezones, labelStyle, displayValue: "UTC" })
  const localTimezone = parseTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone)

  const updatedStudent = async () => {
    await StudentService.updateProfile({
      fullName: fullName !== '' ? fullName : student?.fullName,
      gender: gender !== '' ? gender : student?.gender,
      email: email !== '' ? email : student?.email,
      pronouns: pronouns !== '' ? pronouns : student?.pronouns,
      location: autoSelected ? autoSelectedLocation : location !== '' ? location : student?.location,
      phoneNumber: phone !== '' ? phone : student?.phoneNumber,
      state: autoSelected ? autoSelectedState : state !== '' ? state : student?.state,
      birthday: birthday !== '' ? birthday : student?.birthday,
      timezone: autoSelected ? localTimezone.label : selectedTimezone !== '' ? selectedTimezone : student?.timezone
    })
    dispatch({
      type:"update",
      student:{
        fullName: fullName !== '' ? fullName : student?.fullName,
        gender: gender !== '' ? gender : student?.gender,
        email: email !== '' ? email : student?.email,
        pronouns: pronouns !== '' ? pronouns : student?.pronouns,
        location: autoSelected ? autoSelectedLocation : location !== '' ? location : student?.location,
        phoneNumber: phone !== '' ? phone : student?.phoneNumber,
        state: autoSelected ? autoSelectedState : state !== '' ? state : student?.state,
        birthday: birthday !== '' ? birthday : student?.birthday,
        timezone: autoSelected ? localTimezone.label : selectedTimezone !== '' ? selectedTimezone : student?.timezone
      }
    })
  }

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleSaveClick = async () => {
    try{
      await form.validateFields();
      updatedStudent()
      setEditing(false);
    }catch(e){
      return false;
    }
    return false;
  };

  const success = (pos:{ coords: { latitude: number; longitude: number }}) => {
    const myLat = pos.coords.latitude
    const myLng = pos.coords.longitude
    
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${myLat},${myLng}&key=${GOOGLE_MAP_API_KEY}&language=en`)
      .then(response => response.json())
      .then(address => {
        setAutoSelectedLocation(`${address.results[5].address_components.filter((address_item: AddressDetails) => address_item.types.find(item => item === 'locality'))[0].long_name}, ${address.results[5].address_components.filter((address_item: AddressDetails) => address_item.types.find(item => item === 'country'))[0].long_name}`)
        setAutoSelectedState(address.results[5].address_components.filter((address_item: AddressDetails) => address_item.types.find(item => item === 'administrative_area_level_1'))[0].short_name)
      })
      .catch(error => console.log(error));

  }

  const error = (err: { code: number; message: string }) => {
    console.warn(`ERROR(${err.code}): ${err.message}`)
  }

  const handleSwitchCase = (val: boolean) => {
 
    setAutoSelected(val)
    if(val == true){
      navigator.geolocation.getCurrentPosition(success, error)
    }
  }

  const customSelect = () => {
    return (
      <Select value={autoSelected ? localTimezone.label : selectedTimezone !== '' ? selectedTimezone : student?.timezone} style={{width: 328}} onChange={e => setSelectedTimezone(e)} disabled={ !editing }>
        {options.map(option => (
          <Option key={option.label} value={option.label}>{option.label}</Option>
        ))}
      </Select>
    )
  }

  const optionsLocation: string[]= [
    "Sydney, Australia",
    "Melbourne, Australia",
    "Brisbane, Australia",
    "Perth, Australia",
    "Adelaide, Australia",
    "Canberra, Australia",
    "Gold Coast, Australia",
    "Newcastle, Australia",
    "Greensborough, Australia",
    "Wollongong Australia",
  ]
  const optionsState: string[]= [
    "UNSW",
    "JCU",
  ]

  const handleFilter = (inputValue: string, option: any) =>
    option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
  return (
    <div className={"basic-information"}>
      <h2 className={"basic-information-title"}>Basic Information</h2>

        <Form
          className={"basic-information-form"}
          initialValues={{ timezone: 'auto' }}
          form={form}
        >
          <Form.Item
            name={"fullName"}
            initialValue={student?.fullName}
            rules={[{ required: true,  }]}
            label={"Full Name"}
          >
              <Input className={"input"} disabled={ !editing } defaultValue={student?.fullName ?? ''} style={{color: !editing? "#bfbfbf" : "",backgroundColor: !editing? "#f5f5f5" : ""}} onChange={e => setFullName(e.target.value)} />
          </Form.Item>
          <Form.Item
            name={"gender"}
            label={"Gender"}
            initialValue={student?.gender}
            rules={[{ required: false, }]}
          >
            <Input className={"input"} disabled={ !editing } style={{color: !editing? "#bfbfbf" : "",backgroundColor: !editing? "#f5f5f5" : ""}} defaultValue={student?.gender ?? ''} onChange={e => setGender(e.target.value)} />
          </Form.Item>
          <Form.Item
            name={"pronouns"}
            label={"Pronouns"}
            initialValue={student?.pronouns}
            rules={[{ required: false,}]}
          >
            <Input className={"input"} disabled={ !editing } style={{color: !editing? "#bfbfbf" : "",backgroundColor: !editing? "#f5f5f5" : ""}} defaultValue={student?.pronouns ?? ''} onChange={e => setPronouns(e.target.value)}/>
          </Form.Item>
          <Form.Item
            name={"birthday"}
            label={"Birthday"}
            rules={[{ required: true,}]}
            initialValue={birthday}
          >
            <Input className={"input"} disabled={ !editing } type={"date"} style={{color: !editing? "#bfbfbf" : "",backgroundColor: !editing? "#f5f5f5" : ""}} defaultValue={birthday ?? ''} onChange={e => setBirthday(e.target.value)}/>
          </Form.Item>
          <Form.Item
            name={"email"}
            initialValue={student?.email}
            label={"Email Address"}
            rules={[
              { required: true,  },
              { type: 'email', message: 'Please enter a valid email address' },
            ]}
          >
              <Input className={"input"} disabled={ !editing } style={{color: !editing? "#bfbfbf" : "",backgroundColor: !editing? "#f5f5f5" : ""}} type={"email"} defaultValue={student?.email ?? ''} onChange={e => setEmail(e.target.value)} />
          </Form.Item>
          <Form.Item
            name={"phone"}
            initialValue={phone}
            label={"Phone Number"}
            rules={[{ required: false,  }]}
          >
            <Input className={"input"} disabled={ !editing } style={{color: !editing? "#bfbfbf" : "",backgroundColor: !editing? "#f5f5f5" : ""}} defaultValue={phone ?? ""} onChange={e => setPhone(e.target.value !== '' ? e.target.value : student?.phoneNumber)}/>
          </Form.Item>


          <Form.Item
            name={"location"}
            label={"Location"}
            rules={[{ required: true, }]}
          >
            <div className={"basic-information-form-item"}>
              <AutoComplete
                options={optionsLocation.map((option) => ({ value: option }))}
                style={{ width: 328, color: !editing ? "#bfbfbf" : "" }}
                placeholder={"Enter a value"}
                filterOption={handleFilter}
                value={autoSelected ? autoSelectedLocation : location }
                disabled={!editing}
                onChange={(value) => setLocation(value)}
              />
            </div>
          </Form.Item>
          <Form.Item
            name={"state"}
            label={"State"}
            rules={[{ required: true,  }]}
          >
            <div className={"basic-information-form-item"}>
              <AutoComplete
                options={optionsState.map((option) => ({ value: option }))}
                style={{ width: 328, color: !editing ? "#bfbfbf" : "" }}
                placeholder={"Enter a value"}
                filterOption={handleFilter}
                value={autoSelected ? autoSelectedState : state}
                disabled={!editing}
                onChange={(value) => setState(value)}

              />
            </div>
          </Form.Item>
          <Form.Item
            name={"Timezone"}
            label={"State"}
            rules={[{ required: true, }]}
          >
            <div className={"timezone-wrap"}>
              <div>
                {customSelect()}
                  <div className={"switch-wrap"}>
                    <Switch disabled={!editing} onChange={(e) => handleSwitchCase(e)}/>
                    <p className={"switch-text"}>Set automatically</p>
                  </div>
              </div>
            </div>
          </Form.Item>
            {editing ? (
              <div className={"form-basic-button-wrap"}>
                <Button className={"form-button"} onClick={handleSaveClick}>Save</Button>
              </div>
            ) : (
              <div className={"form-basic-button-wrap"}>
                <Button className={"form-button"} onClick={handleEditClick}>Edit</Button>
              </div>
            )}
        </Form>
    </div>
  )
}

export default BasicInfoForm
