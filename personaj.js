import React, { useContext, useEffect, useState } from 'react'
import styles from '@/styles/pages/profile.module.scss'
import Dropdown, { DropdownStylingVariants } from '@/components/dropdown'
import useSWR from 'swr'
import { getCookie } from 'cookies-next'
import { useRouter } from 'next/router'
import ToastContext from '@/context/Toast/toastContext'
import formStyles from '@/styles/components/form/form.module.scss'
import Select from '@/components/select'
import Button from '@/components/button'
import Popout from '@/components/popout'
import { t } from '@/utils/translate'

import { ChevronDownIcon } from '@/components/icons'

export default function Personal() {
  const { timezones } = useSWR('/api/core/timezones')

  //Language
  const router = useRouter()
  const toastContext = useContext(ToastContext)
  const [languages, setLanguages] = useState([])

  //Country
  const [country, setCountry] = useState('')
  const [countryControlValue, setCountryControlValue] = useState(
    t('signupforfree.Countries.Title.short'),
  )
  //Timezone
  const [timezone, setTimezone] = useState('')
  const [timezoneControlValue, setTimezoneControlValue] = useState(
    t('signupforfree.Countries.Title.short'),
  )

  //Language
  const [error, setError] = useState({
    err: false,
    message: 'Please select a language',
  })

  //Language
  const { data: masterData } = useSWR('/api/master')
  const { phone } = router.query

  useEffect(() => {
    if (error.err === true && languages.length === 0) {
      setError({
        ...error,
        err: true,
      })
    } else {
      setError({
        ...error,
        err: false,
      })
    }

    console.log(languages)
  }, [languages])

  const handleNext = async () => {
    try {
      if (languages.length === 0) {
        setError({
          ...error,
          err: true,
        })
      } else {
        const token = getCookie('user_token')
        let res = await fetch('/api/auth/updateUser', {
          body: JSON.stringify({
            languages: languages.map((e) => e.id).join(', '),
            firebase_access_token: token,
          }),
          method: 'POST',
        })

        const response = await res.json()

        router.push({
          pathname: '/app',
        })
      }
    } catch (err) {
      toastContext.setToast({
        message: "There's an error occured, please try again.",
        type: 'error',
      })
    }
  }

  //country
  const handleCountry = (selectedOption) => {
    setCountry(selectedOption)
    setCountryControlValue(selectedOption.label)
    /*
        if (isMulti) {
          mappedValue = value.reduce((current, value) => `${current}${value.label}, `, "");
          setControlValue(mappedValue);
        } else {
          setControlValue(value.label);
        }
        */
  }
  //country
  const handleTimezone = (selectedOption) => {
    setTimezone(selectedOption)
    setTimezoneControlValue(selectedOption.label)
    /*
            if (isMulti) {
              mappedValue = value.reduce((current, value) => `${current}${value.label}, `, "");
              setControlValue(mappedValue);
            } else {
              setControlValue(value.label);
            }
            */
  }

  //Education Background
  const [personalProfileForm, setPersonalProfileForm] = useState({
    location: '',
  })
  const updateFormData = (arg, value) =>
    setPersonalProfileForm((fields) => {
      return {
        ...fields,
        [arg]: value,
      }
    })

  return (
    <form className={styles.form}>
      <div className={styles.form_group}>
        <label>Your Location</label>
        <input
          placeholder={
            'Type the city where you live currently. Ex: Istanbul, Berlin, London...'
          }
        />
      </div>
      <div className={styles.form_group}>
        <label>Your Nationality</label>
        <div className={styles.country_select}>
          <Popout
            options={
              masterData?.result === 'success'
                ? masterData.data.country_list
                    .map((country) => ({
                      value: country.country_code,
                      label: `${country.country_name} `,
                    }))
                    .sort((a, b) => (a.country_name > b.country_name ? -1 : 1))
                : []
            }
            closeOnMenuSelect={true}
            onChange={handleCountry}
            controlValue={countryControlValue}
            selectValue={country}
            controlStyles={{
              display: 'flex !important',
              inlineSize: '100 !important',
            }}
            placeholder="Country"
            containerStyles={{
              width: '100 !important',
            }}
            menuProps={{}}
            menuListProps={{
              title: t('signupforfree.Countries.Title'),
              description: t('signupforfree.Countries.Description'),
            }}
          />
        </div>
      </div>
      <div className={styles.form_group}>
        <label>Language(s) You Speak</label>
        {/*step4*/}
        <Dropdown
          options={
            masterData?.result === 'success'
              ? masterData.data.langauges_list.map((language) => ({
                  id: language.language_id,
                  label: language.language,
                }))
              : []
          }
          setValue={setLanguages}
          max={5}
          hasCheckbox
          hasSearch
        />
        {error.err && (
          <span className={formStyles.error} role="alert">
            {error.message}
          </span>
        )}
      </div>
      <div className={styles.form_group}>
        <label>Your Profession</label>
        <input
          placeholder={'Type the occupation that you are doing it currently'}
        />
      </div>
      <div className={styles.form_group}>
        <label>Your Educational Background</label>
        <Select
          isSearchable={true}
          isMulti={false}
          closeOnMenuSelect={true}
          placeholder={
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                margin: 0,
                padding: 0,
                input: {
                  margin: '0 !important',
                },
              }}
            >
              <span
                style={{
                  display: '-webkit-box',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  fontSize: 14,
                  margin: 0,
                  padding: 0,
                  input: {
                    margin: '0 !important',
                  },
                }}
              >
                Select your latest graduation from a school or an educational
                institution
              </span>
            </div>
          }
          menuStyles={{
            marginTop: '0px',
          }}
          controlStyles={{
            inlineSize: '100%',
            blockSize: '36px',
            paddingInline: '.25rem',
            boxShadow: 'none',
            borderRadius: 'var(--radius-s)',
            transition: '200ms box-shadow',
            height: 'auto !important',
            cursor: 'text',
            '&:hover': {
              boxShadow: '0 0 0 1px var(--primary-500)',
            },
            '&:focus': {
              outline: 'unset',
              boxShadow: '0 0 0 1px var(--primary-500)',
            },
          }}
          dropdownIcon={<ChevronDownIcon />}
          renderValue={personalProfileForm.gender}
          value={personalProfileForm.gender}
          onChange={(value) => updateFormData('gender', value)}
          options={[
            { value: 0, label: 'High School' },
            { value: 1, label: 'Associated Degree' },
            { value: 2, label: 'Bachelor’s Degree' },
            { value: 3, label: 'Master’s Degree or Higher' },
          ]}
        />
      </div>
      <div className={styles.form_group}>
        <label>Your Time Zone</label>
        <div className={styles.country_select}>
          <Popout
            options={
              Array.isArray(timezones?.results)
                ? timezones?.results?.map((el) => ({
                    value: el?.id,
                    label: el?.label,
                  }))
                : []
            }
            closeOnMenuSelect={true}
            onChange={handleTimezone}
            controlValue={timezoneControlValue}
            selectValue={timezone}
            controlStyles={{
              display: 'flex !important',
              inlineSize: '100 !important',
            }}
            placeholder=""
            containerStyles={{
              width: '100 !important',
            }}
            menuProps={{}}
            // menuListProps={{
            //   title: t('signupforfree.Countries.Title'),
            //   description: t('signupforfree.Countries.Description'),
            // }}
          />
        </div>
      </div>
      <div className={styles.buttons}>
        <Button>Save</Button>
      </div>
    </form>
  )
}
