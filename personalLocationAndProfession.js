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
import { useForm } from 'react-hook-form'

import { ChevronDownIcon } from '@/components/icons'

export default function Personal() {
  const { userProfile } = useSWR('/api/user/get_profile')

  const [personalProfileForm, setPersonalProfileForm] = useState({
    location: '',
    profession: '',
  })
  useEffect(() => {
    fetch('/api/user/get_profile', {
      method: 'GET',
    }).then(async (res) => {
      let result = await res.json()
      console.log('RESULT', result)

      setPersonalProfileForm({
        ...personalProfileForm,
        location: result.user_detail?.location,
        profession: result.user_detail?.profession,
      })
      // console.log("personalProfileForm", personalProfileForm);
    })
  }, [])

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const toastContext = useContext(ToastContext)

  const updateFormData = (arg, value) =>
    setPersonalProfileForm((fields) => {
      return {
        ...fields,
        [arg]: value,
      }
    })

  const onSubmit = () => onSave()
  const onSave = async (type = 'basic_form') => {
    console.log('save', personalProfileForm)

    try {
      let setData = {}
      if (type === 'basic_form') {
        setData = personalProfileForm
      } else if (type === 'profile_pic') {
        setData = {
          profile_pic: personalProfileForm.profile_pic,
        }
      }

      const formData = new FormData()
      formData.append('user_detail.location', personalProfileForm.location)
      formData.append('user_detail.profession', personalProfileForm.profession)

      const res = await fetch('/api/user/profile', {
        body: formData,
        method: 'PUT',
      })

      toastContext.setToast({
        message: 'Profile updated successfully.',
        type: 'success',
      })
    } catch (err) {
      console.error('Error while updating profile.', err)

      toastContext.setToast({
        message: "Profile couldn't updated, please try again.",
        type: 'error',
      })
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.form_group}>
        <label>Your Location</label>
        <input
          // {...register("location", {
          //   pattern: {
          //     value: /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm,

          //     message: "Please enter a valid  location"
          //   }
          // })}
          placeholder={''}
          value={personalProfileForm.location}
          onChange={(e) => updateFormData('location', e.target.value)}
        />
        {errors.location && (
          <span className={formStyles.error} role="alert">
            {errors?.location?.message}
          </span>
        )}
      </div>
      <div className={styles.form_group}>
        <label>Your Profession</label>
        <input
          // {...register("profession", {
          //   pattern: {
          //     value: /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm,

          //     message: "Please enter a valid  profession"
          //   }
          // })}
          placeholder={''}
          value={personalProfileForm.profession}
          onChange={(e) => updateFormData('profession', e.target.value)}
        />
        {/* {errors.profession && (
          <span className={formStyles.error} role="alert">
            {errors?.profession?.message}
          </span>
        )} */}
      </div>
      <div className={styles.buttons}>
        <Button type="submit">Save</Button>
      </div>
    </form>
  )
}
