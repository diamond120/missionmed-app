import "./index.less"
import { AutoComplete, Button, Form, Input, Select, Switch, Spin, InputNumber } from "antd"
import { FC, useMemo, useState } from "react"
import { useTimezoneSelect, allTimezones } from "react-timezone-select"
import { AddressDetails } from "../../../types/AddressDetails"
import { useTutor, useTutorDispatch } from "../../../api/providers/TutorProvider";
import TutorService from "../../../api/services/Tutor";
import { GOOGLE_MAP_API_KEY } from "../../../config/app-config";
import { useProfileStaticDataContext } from "../../../api/context/ProfileStaticDataContext";
import { AgeList } from "../../../common/common";
import countryList from 'react-select-country-list';

const BasicInfoForm: FC<Any> = ({ props }) => {

  const [form] = Form.useForm();
  const { Option } = Select;
  const tutor = useTutor();
  const dispatch = useTutorDispatch();
  const profileStaticData = useProfileStaticDataContext();
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState<string | undefined | null>('')
  const [gender, setGender] = useState<string | undefined | null>('')
  const [pronouns, setPronouns] = useState<string | undefined | null>('')
  const [email, setEmail] = useState<string | undefined | null>('')
  const [phone, setPhone] = useState<string | undefined | null>('')
  const [location, setLocation] = useState<string | undefined | null>('')
  const [autoSelected, setAutoSelectedTimezone] = useState<boolean>(false)
  const [autoSelectedLocation, setAutoSelectedLocation] = useState<string>('')
  const labelStyle = 'original'
  const timezones = {
    ...allTimezones,
  }
  const { options, parseTimezone } = useTimezoneSelect({ timezones, labelStyle, displayValue: "UTC" })
  const localTimezone = parseTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone)

  const countries = useMemo(() => countryList().getData(), [])
  const [country, setCountry] = useState('')

  const updatedTutor = async () => {
    await TutorService.updateProfile({
      fullName: fullName !== '' ? fullName : tutor?.fullName,
      gender: gender !== '' ? gender : tutor?.gender,
      email: email !== '' ? email : tutor?.email,
      phoneNumber: phone !== '' ? phone : tutor?.phoneNumber,
      pronouns: pronouns !== '' ? pronouns : tutor?.pronouns,
      location: autoSelected ? autoSelectedLocation : location !== '' ? location : tutor?.location,
      timezone: form.getFieldValue('timezone'),
      country: country !== '' ? country : tutor?.country,
    });
    dispatch({
      type: 'update',
      tutor: {
        fullName: fullName !== '' ? fullName : tutor?.fullName,
        gender: gender !== '' ? gender : tutor?.gender,
        email: email !== '' ? email : tutor?.email,
        phoneNumber: phone !== '' ? phone : tutor?.phoneNumber,
        pronouns: pronouns !== '' ? pronouns : tutor?.pronouns,
        location: autoSelected ? autoSelectedLocation : location !== '' ? location : tutor?.location,
        timezone: form.getFieldValue('timezone'),
        country: country !== '' ? country : tutor?.country
      }
    })
  }

  const optionsLocation: string[] = (profileStaticData.location ? profileStaticData.location.map(l => ({ key: l.id, label: l.title, value: l.title })) : [])

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      await form.validateFields();
      updatedTutor()
      setEditing(false);
    } catch (e) {
      return false;
    }
    return false;
  };

  const cancle = () => {
    form.resetFields();
    setEditing(false);
  }

  const success = (pos: { coords: { latitude: number; longitude: number } }) => {
    const myLat = pos.coords.latitude
    const myLng = pos.coords.longitude

    fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${myLat},${myLng}&key=${GOOGLE_MAP_API_KEY}&language=en`)
      .then(response => response.json())
      .then(address => {
        setAutoSelectedLocation(`${address.results[5].address_components.filter((address_item: AddressDetails) => address_item.types.find(item => item === 'locality'))[0].long_name}, ${address.results[5].address_components.filter((address_item: AddressDetails) => address_item.types.find(item => item === 'country'))[0].long_name}`)
      })
      .catch(error => console.log(error));

  }

  const error = (err: { code: number; message: string }) => {
    console.warn(`ERROR(${err.code}): ${err.message}`)
  }

  const handleSwitchCase = (val: boolean) => {
    setAutoSelectedTimezone(val);
    if (val == true) {
      form.setFieldValue('timezone', localTimezone.label);
      navigator.geolocation.getCurrentPosition(success, error)
    }
  }

  const customSelect = () => {
    return (
      <Select style={{ width: 328 }} disabled={!editing}>
        {options.map(option => (
          <Option key={option.label} value={option.label}>{option.label}</Option>
        ))}
      </Select>
    )
  }

  const handleFilter = (inputValue: string, option: any) => option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1

  if (tutor?.loading) {
    return (
      <Spin />
    )
  }

  return (
    <div className={"basic-information"}>
      <h2 className={"basic-information-title"}>Basic Information</h2>

      <Form className={"basic-information-form"} form={form} colon={false}>
        <Form.Item
          name={"fullName"}
          label={"Full Name"}
          rules={[{ required: true }]}
          initialValue={tutor?.fullName ?? ""}
        >
          <Input
            className={"input"}
            disabled={!editing}
            style={{
              color: !editing ? "#bfbfbf" : "",
              backgroundColor: !editing ? "#f5f5f5" : "",
            }}
            onChange={(e) => setFullName(e.target.value)}
          />
        </Form.Item>
        <Form.Item
          name={"gender"}
          label={"Gender"}
          rules={[{ required: true }]}
          initialValue={tutor?.gender ?? ""}
        >
          <Select
            options={AgeList.map((option) => ({ value: option }))}
            style={{ width: 328, color: !editing ? "#bfbfbf" : "" }}
            disabled={!editing}
            onChange={(value) => setGender(value)}
          />
        </Form.Item>
        <Form.Item
          name={"pronouns"}
          label={"Pronouns"}
          rules={[{ required: true }]}
          initialValue={tutor?.pronouns ?? ""}
        >
          <Input
            className={"input"}
            disabled={!editing}
            style={{
              color: !editing ? "#bfbfbf" : "",
              backgroundColor: !editing ? "#f5f5f5" : "",
            }}
            onChange={(e) => setPronouns(e.target.value)}
          />
        </Form.Item>
        <Form.Item
          name={"email"}
          label={"Email Address"}
          rules={[
            { required: true, message: "Please enter your email address" },
            { type: "email", message: "Please enter a valid email address" },
          ]}
          initialValue={tutor?.email ?? ""}
        >
          <Input
            className={"input"}
            disabled={!editing}
            style={{
              color: !editing ? "#bfbfbf" : "",
              backgroundColor: !editing ? "#f5f5f5" : "",
            }}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Item>
        <Form.Item
          name={"phone"}
          initialValue={tutor?.phoneNumber}
          label={"Phone Number"}
          rules={[
            { required: true },
            {
              pattern: /^[\d]{0,10}$/,
              message: "Phone number should have maximum 10 characters"
            }
          ]}
        >
          <InputNumber className={"input"} disabled={!editing} style={{ color: !editing ? "#bfbfbf" : "", backgroundColor: !editing ? "#f5f5f5" : "" }} onChange={value => setPhone(value !== null ? value : tutor?.phoneNumber)} />
        </Form.Item>
        <Form.Item
          name={"country"}
          label={"Country"}
          rules={[{ required: true, }]}
          initialValue={tutor?.country}
        >
          <Select options={countries} value={country} style={{ width: 328, color: !editing ? "#bfbfbf" : "" }} disabled={!editing} onChange={(value) => setCountry(value)} />
        </Form.Item>

        <Form.Item
          name={"location"}
          label={"Location"}
          initialValue={tutor?.location}
          rules={[{ required: true, message: "Please enter your location" }]}

        >
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
          name={"timezone"}
          label={"Timezone"}
          rules={[{ required: true }]}
          initialValue={tutor?.timezone}
          style={{ marginBottom: 5 }}
        >
          {customSelect()}
        </Form.Item>
        <div className={"switch"} >
          <div>
            <div className={"switch-wrap"}>
              <Switch
                disabled={!editing}
                onChange={(e) => handleSwitchCase(e)}
              />
              <p className={"switch-text"}>Set automatically</p>
            </div>
          </div>
        </div>
        {editing ? (
          <>
            <div className={"form-basic-button-wrap"}>
              <Button className={"form-button"} onClick={handleSaveClick}>
                Save
              </Button>
              <Button className={"form-button button-space"} onClick={cancle}>
                Cancel
              </Button>
            </div>
          </>

        ) : (
          <div className={"form-basic-button-wrap"}>
            <Button className={"form-button"} onClick={handleEditClick}>
              Edit
            </Button>
          </div>
        )}
      </Form>
    </div>
  );

}

export default BasicInfoForm