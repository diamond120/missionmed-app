import "./index.less"
import { Form, Input, Select, Switch, Button, AutoComplete, InputNumber, DatePicker, Spin } from "antd"
import { FC, useEffect, useMemo, useRef, useState } from "react"
import { useTimezoneSelect, allTimezones } from "react-timezone-select"
import { AddressDetails } from "../../../types/AddressDetails"
import { useStudent, useStudentDispatch } from "../../../api/providers/StudentProvider";
import { default as StudentService } from "../../../api/services/Student";
import { GOOGLE_MAP_API_KEY } from "../../../config/app-config";
import { useProfileStaticDataContext } from "../../../api/context/ProfileStaticDataContext";
import { AgeList } from "../../../common/common";
import moment from "moment"
import type { RangePickerProps } from 'antd/es/date-picker';
import countryList from 'react-select-country-list';

const { Option } = Select;

const BasicInfoForm: FC<any> = ({ props }) => {

  const [form] = Form.useForm();
  const student = useStudent();
  const dispatch = useStudentDispatch();
  const profileStaticData = useProfileStaticDataContext();
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState<string | undefined | null>('')
  const [gender, setGender] = useState<string | undefined | null>('')
  const [pronouns, setPronouns] = useState<string | undefined | null>('')
  const [email, setEmail] = useState<string | undefined | null>('')
  const [birthday, setBirthday] = useState(student.birthday)
  const [phone, setPhone] = useState<string | undefined | null>(student?.phoneNumber)
  const [location, setLocation] = useState<string | undefined | null>(student?.location)
  const [state, setState] = useState<string | undefined | null>(student?.state)
  const [autoSelected, setAutoSelected] = useState<boolean>(false)
  const [autoSelectedLocation, setAutoSelectedLocation] = useState<string>('')
  const [autoSelectedState, setAutoSelectedState] = useState<string>('')

  const countries = useMemo(() => countryList().getData(), [])
  const [country, setCountry] = useState('')

  const labelStyle = 'original'
  const timezones = {
    ...allTimezones,
  }

  const { options, parseTimezone } = useTimezoneSelect({ timezones, labelStyle, displayValue: "UTC" })
  const localTimezone = parseTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone)

  const dateFormat = 'DD/MM/YYYY';

  // const autoCompleteRef = useRef();
  // const inputRef = useRef();
  // const optionAdd = {
  //   componentRestrictions: { country: "ng" },
  //   fields: ["address_components", "geometry", "icon", "name"],
  //   types: ["establishment"]
  // };

  // useEffect(() => {
  //   autoCompleteRef.current = new window.google.maps.places.Autocomplete(
  //     inputRef.current,
  //     optionAdd
  //   );
  // }, []);

  const updatedStudent = async () => {
    await StudentService.updateProfile({
      fullName: fullName !== '' ? fullName : student?.fullName,
      gender: gender !== '' ? gender : student?.gender,
      email: email !== '' ? email : student?.email,
      pronouns: pronouns !== '' ? pronouns : student?.pronouns,
      location: autoSelected ? autoSelectedLocation : location !== '' ? location : student?.location,
      phoneNumber: phone !== '' ? phone : student?.phoneNumber,
      state: autoSelected ? autoSelectedState : state !== '' ? state : student?.state,
      birthday: birthday !== '' ? moment(birthday.dateFormat).format('YYYY-MM-DD') : student?.birthday,
      timezone: form.getFieldValue('timezone'),
      country: country !== '' ? country : student?.country,
    })
    dispatch({
      type: "update",
      student: {
        fullName: fullName !== '' ? fullName : student?.fullName,
        gender: gender !== '' ? gender : student?.gender,
        email: email !== '' ? email : student?.email,
        pronouns: pronouns !== '' ? pronouns : student?.pronouns,
        location: autoSelected ? autoSelectedLocation : location !== '' ? location : student?.location,
        phoneNumber: phone !== '' ? phone : student?.phoneNumber,
        state: autoSelected ? autoSelectedState : state !== '' ? state : student?.state,
        birthday: birthday !== '' ? moment(birthday, dateFormat).format('YYYY-MM-DD') : student?.birthday,
        timezone: form.getFieldValue('timezone'),
        country: country !== '' ? country : student?.country,
      }
    })
  }

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      await form.validateFields();
      updatedStudent()
      setEditing(false);
    } catch (e) {
      return false;
    }
    return false;
  };

  const success = (pos: { coords: { latitude: number; longitude: number } }) => {
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
    if (val == true) {
      form.setFieldValue('timezone', localTimezone.label);
      navigator.geolocation.getCurrentPosition(success, error)
    }
  }

  const customSelect = () => {
    return (
      <Select style={{ width: 328 }} disabled={!editing}>
        {options && options.map(option => (
          <Option key={option.label} value={option.label}>{option.label}ss</Option>
        ))}
      </Select>
    )
  }

  const optionsLocation: string[] = (profileStaticData.location) ? profileStaticData.location.map(l => ({ key: l.id, label: l.title, value: l.title })) : {}
  const optionsState: string[] = (profileStaticData.state) ? profileStaticData.state.map(s => ({ key: s.id, label: s.title, value: s.title })) : {}

  const handleFilter = (inputValue: string, option: any) =>
    option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1


  const disabledDate: RangePickerProps['disabledDate'] = current => {
    return current && current > moment().endOf('day');
  };

  const cancle = () => {
    form.resetFields();
    setEditing(false);
  }

  if (student?.loading) {
    return (
      <Spin />
    )
  }

  return (
    <div className={"basic-information"}>
      <h2 className={"basic-information-title"}>Basic Information</h2>
      <Form
        className={"basic-information-form"}
        form={form}
        colon={false}
      >
        <Form.Item
          name={"fullName"}
          initialValue={student?.fullName}
          rules={[{ required: true, }]}
          label={"Full Name"}
        >
          <Input className={"input"} disabled={!editing} style={{ color: !editing ? "#bfbfbf" : "", backgroundColor: !editing ? "#f5f5f5" : "" }} onChange={e => setFullName(e.target.value)} />
        </Form.Item>
        <Form.Item
          name={"gender"}
          label={"Gender"}
          initialValue={student?.gender}
          rules={[{ required: false, }]}
        >
          <Select
            options={AgeList && AgeList?.length > 0 ? AgeList?.map((option) => ({ value: option })) : []}
            style={{ width: 328, color: !editing ? "#bfbfbf" : "" }}
            disabled={!editing}
            onChange={(value) => setGender(value)}
          />
        </Form.Item>
        <Form.Item
          name={"pronouns"}
          label={"Pronouns"}
          initialValue={student?.pronouns}
          rules={[{ required: false, }]}
        >
          <Input className={"input"} disabled={!editing} style={{ color: !editing ? "#bfbfbf" : "", backgroundColor: !editing ? "#f5f5f5" : "" }} onChange={e => setPronouns(e.target.value)} />
        </Form.Item>
        <Form.Item
          name={"birthday"}
          label={"Birthday"}
          rules={[{ required: true, }]}
          initialValue={birthday ? moment(birthday) : ""}
        >
          <DatePicker className={"input"} disabled={!editing} style={{ color: !editing ? "#bfbfbf" : "", backgroundColor: !editing ? "#f5f5f5" : "" }} placeholder="dd/mm/yyyy" disabledDate={disabledDate} format={dateFormat} onChange={(value, valueString) => setBirthday(valueString)} />

        </Form.Item>
        <Form.Item
          name={"email"}
          initialValue={student?.email}
          label={"Email Address"}
          rules={[
            { required: true, },
            { type: 'email', message: 'Please enter a valid email address' },
          ]}
        >
          <Input className={"input"} disabled={!editing} style={{ color: !editing ? "#bfbfbf" : "", backgroundColor: !editing ? "#f5f5f5" : "" }} type={"email"} onChange={e => setEmail(e.target.value)} />
        </Form.Item>
        <Form.Item
          name={"phone"}
          initialValue={phone}
          label={"Phone Number"}
          rules={[
            { required: true, },
            {
              pattern: /^[\d]{0,10}$/,
              message: "Phone number should have maximum 10 characters"
            }
          ]}
        >
          <InputNumber className={"input"} disabled={!editing} style={{ color: !editing ? "#bfbfbf" : "", backgroundColor: !editing ? "#f5f5f5" : "" }} onChange={value => setPhone(value !== null ? value : student?.phoneNumber)} />
        </Form.Item>

        <Form.Item
          name={"country"}
          label={"Country"}
          rules={[{ required: true, }]}
          initialValue={student?.country}
        >
          <Select options={countries} value={country} style={{ width: 328, color: !editing ? "#bfbfbf" : "" }} disabled={!editing} onChange={(value) => setCountry(value)} />
        </Form.Item>
        <Form.Item
          name={"location"}
          label={"Location"}
          rules={[{ required: true, }]}
          initialValue={student?.location}
        >

          {/* <input  className={"input"} ref={inputRef}  style={{ width: 328, color: !editing ? "#bfbfbf" : "" }}/> */}
          <AutoComplete
            options={optionsLocation}
            style={{ width: 328, color: !editing ? "#bfbfbf" : "" }}
            placeholder={"Enter a value"}
            filterOption={handleFilter}
            value={autoSelected ? autoSelectedLocation : location}
            disabled={!editing}
            onChange={(value) => setLocation(value)}
          />
        </Form.Item>
        <Form.Item
          name={"state"}
          label={"Curriculum"}
          rules={[{ required: true, }]}
          initialValue={student?.state}
        >
          <AutoComplete
            options={optionsState}
            style={{ width: 328, color: !editing ? "#bfbfbf" : "" }}
            placeholder={"Enter a value"}
            filterOption={handleFilter}
            value={autoSelected ? autoSelectedState : state}
            disabled={!editing}
            onChange={(value) => setState(value)}
          />
        </Form.Item>
        <Form.Item
          name={"timezone"}
          label={"Timezone"}
          rules={[{ required: true, }]}
          initialValue={student?.timezone}
          style={{marginBottom:5}}
        >
          {customSelect()}
        </Form.Item>
        <div className={"switch"}>
          <div>
            <div className={"switch-wrap"}>
              <Switch disabled={!editing} onChange={(e) => handleSwitchCase(e)} />
              <p className={"switch-text"}>Set automatically</p>
            </div>
          </div>
        </div>
        {editing ? (
          <div className={"form-basic-button-wrap"}>
            <Button className={"form-button"} onClick={handleSaveClick}>Save</Button>
            <Button className={"form-button button-space"} onClick={cancle}>
              Cancel
            </Button>
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