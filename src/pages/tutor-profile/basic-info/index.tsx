import "./index.less"
import { AutoComplete, Button, Form, Input, Select, Switch } from "antd"
import { FC, useState } from "react"
// import { useUpdateTutorMutation } from "../../../graphql"
import { useTimezoneSelect, allTimezones } from "react-timezone-select"
import { AddressDetails } from "../../../types/AddressDetails"


const BasicInfoForm: FC<{tutor: Tutor, id:string}> = ({tutor, id}) => {
  const { Option } = Select;
  // const [updateTutor]= useUpdateTutorMutation()
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState<string | undefined | null>('')
  const [gender, setGender] = useState<string | undefined | null>('')
  const [pronouns, setPronouns] = useState<string | undefined | null>('')
  const [email, setEmail] = useState<string | undefined | null>('')
  const [location, setLocation] = useState<string | undefined | null>('')
  const [selectedTimezone, setSelectedTimezone] = useState<string | undefined | null>('')
  const [autoSelected, setAutoSelectedTimezone] = useState<boolean>(false)
  const [autoSelectedLocation, setAutoSelectedLocation] = useState<string>('')

  const labelStyle = 'original'
  const timezones = {
    ...allTimezones,
  }

  const { options, parseTimezone } = useTimezoneSelect({ timezones, labelStyle, displayValue: "UTC" })
  const localTimezone = parseTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone)

  const updatedTutor =  async () => {
    // await updateTutor({
    //   variables: {
    //     id: id!,
    //     input: {
    //       full_name: fullName !== '' ? fullName : tutor?.full_name,
    //       gender: gender !== '' ? gender : tutor?.gender,
    //       email_address: email !== '' ? email : tutor?.email_address,
    //       pronouns: pronouns !== '' ? pronouns : tutor?.pronouns,
    //       location: autoSelected ? autoSelectedLocation : location !== '' ? location : tutor?.location,
    //       timezone: autoSelected ? localTimezone.label : selectedTimezone !== '' ? selectedTimezone : tutor?.timezone

    //     }
    //   }
    // })
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

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleSaveClick =() => {
    updatedTutor()
    setEditing(false);
  };

  const success = (pos:{ coords: { latitude: number; longitude: number }}) => {
    const myLat = pos.coords.latitude
    const myLng = pos.coords.longitude

    fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${myLat},${myLng}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&language=en`)
      .then(response => response.json())
      .then(address => {
        setAutoSelectedLocation(`${address.results[5].address_components.filter((address_item: AddressDetails) => address_item.types.find(item => item === 'locality'))[0].long_name}, ${address.results[5].address_components.filter((address_item: AddressDetails) => address_item.types.find(item => item === 'country'))[0].long_name}`)
      })
      .catch(error => console.log(error));

  }

  const error = (err: { code: number; message: string }) => {
    console.warn(`ERROR(${err.code}): ${err.message}`)
  }

  const handleSwitchCase = (e: boolean) => {
    setAutoSelectedTimezone(e)
    navigator.geolocation.getCurrentPosition(success, error)
  }

  const customSelect = () => {
    return (
      <Select value={autoSelected ? localTimezone.label : selectedTimezone !== '' ? selectedTimezone : tutor?.timezone} style={{width: 328}} onChange={e => setSelectedTimezone(e)} disabled={ !editing }>
        {options.map(option => (
          <Option key={option.label} value={option.label}>{option.label}</Option>
        ))}
      </Select>
    )
  }

  const handleFilter = (inputValue: string, option: any) =>
    option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1;
  return(
    <div className={"basic-information"}>
      <h2 className={"basic-information-title"}>Basic Information</h2>

      <Form
        className={"basic-information-form"}
        initialValues={{ timezone: 'auto' }}
      >
        <Form.Item
          name={"fullName"}
          label={"Full Name"}
          rules={[{ required: true, }]}
        >
            <Input className={"input"} disabled={ !editing } style={{color: !editing? "#bfbfbf" : "", backgroundColor: !editing? "#f5f5f5" : "" }} defaultValue={tutor?.full_name ?? ''}  onChange={e => setFullName(e.target.value)}  />
        </Form.Item>
        <Form.Item
          name={"gender"}
          label={"Gender"}
          rules={[{ required: true, }]}
        >
            <Input className={"input"} disabled={ !editing } style={{color: !editing? "#bfbfbf" : "",backgroundColor: !editing? "#f5f5f5" : ""}} defaultValue={tutor?.gender ?? ''}  onChange={e => setGender(e.target.value)} />
        </Form.Item>
        <Form.Item
          name={"pronouns"}
          label={"Pronouns"}
          rules={[{ required: true,}]}
        >
          
            <Input className={"input"} disabled={ !editing } style={{color: !editing? "#bfbfbf" : "",backgroundColor: !editing? "#f5f5f5" : ""}} defaultValue={tutor?.pronouns ?? ''}  onChange={e => setPronouns(e.target.value)} />
          
        </Form.Item>
        <Form.Item
          name={"email"}
          label={"Email Address"}
          rules={[
            { required: true, message: 'Please enter your email address' },
            { type: 'email', message: 'Please enter a valid email address' },
          ]}
        >
            <Input className={"input"} disabled={ !editing } style={{color: !editing? "#bfbfbf" : "",backgroundColor: !editing? "#f5f5f5" : ""}} defaultValue={tutor?.email_address?? ''}  onChange={e => setEmail(e.target.value)} />
        </Form.Item>
        <Form.Item
          name={"location"}
          label={"Location"}
          rules={[{ required: true, message: 'Please enter your location' }]}
        >
          
        <AutoComplete
          options={optionsLocation.map((option) => ({ value: option }))}
          style={{ width: 328, color: !editing ? "#bfbfbf" : "" }}
          placeholder={"Enter a value"}
          filterOption={handleFilter}
          value={autoSelected ? autoSelectedLocation : location }
          disabled={!editing}
          onChange={(value) => setLocation(value)}

        />
        </Form.Item>
        <Form.Item
          name={"timezone"}
          label={"Timezone"}
          rules={[{ required: true, message: 'Please enter your time zone' }]}
        >
          <div className={"timezone-wrap"}>
            <div >
              {customSelect()}
              <div className={"switch-wrap"}>
                <Switch disabled={!editing} onChange={(e) => handleSwitchCase(e)} />
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