'use client'

import {
  Box,
  Button,
  Divider,
  IconButton,
  MenuItem,
  Paper,
  TextField,
  Typography
} from '@mui/material'

import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'

import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { DatePicker, TimePicker } from '@mui/x-date-pickers'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import axios from 'axios'
import { toast } from 'react-toastify'
import { z } from 'zod'

import {
  createVaccinationScheduleAPI,
  getVaccinationLocationAPI,
  getAllVaccineAPI,
  getVaccinationStaffAPI,
  type Vaccine,
  type VaccinationStaff,
  type VaccinationLocation
} from '@/services/vaccination-schedule.service'

// ======================================================
// VALIDATION
// ======================================================

const scheduleSchema = z
  .object({
    vaccinationDate: z.string().min(1, 'Vui lòng chọn ngày tiêm'),
    vaccinationTime: z.string().min(1, 'Vui lòng chọn giờ tiêm'),

    vaccine_id: z
      .number({ message: 'Vui lòng chọn vaccine' })
      .min(1, 'Vui lòng chọn vaccine'),

    capacity: z
      .number({ message: 'Vui lòng nhập số lượng' })
      .int('Số lượng phải là số nguyên')
      .min(1, 'Số lượng phải lớn hơn 0'),
    age: z.string().trim().min(1, 'Vui lòng nhập độ tuổi').max(100),

    user_id: z
      .number({ message: 'Vui lòng chọn nhân viên y tế' })
      .min(1, 'Vui lòng chọn nhân viên y tế'),

    location_id: z
      .number({ message: 'Vui lòng chọn địa điểm tiêm' })
      .min(1, 'Vui lòng chọn địa điểm tiêm'),

    note: z.string().trim().max(500, 'Ghi chú không được vượt quá 500 ký tự')
  })
  .refine(
    (data) =>
      dayjs(`${data.vaccinationDate}T${data.vaccinationTime}`).isAfter(dayjs()),
    {
      message: 'Ngày giờ tiêm phải lớn hơn thời gian hiện tại',
      path: ['vaccinationTime']
    }
  )

type ScheduleFormData = z.infer<typeof scheduleSchema>

// ======================================================
// COMPONENT
// ======================================================

const ScheduleCreate = () => {
  const router = useRouter()

  const [vaccines, setVaccines] = useState<Vaccine[]>([])
  const [staff, setStaff] = useState<VaccinationStaff[]>([])
  const [locations, setLocations] = useState<VaccinationLocation[]>([])

  // ====================================================
  // LOAD DATA
  // ====================================================

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vaccinesData, staffData, locationData] = await Promise.all([
          getAllVaccineAPI(),
          getVaccinationStaffAPI(),
          getVaccinationLocationAPI()
        ])

        setVaccines(vaccinesData)
        setStaff(staffData)
        setLocations(locationData)
      } catch (error) {
        console.error('Lỗi lấy dữ liệu:', error)
        toast.error('Không thể tải dữ liệu')
      }
    }

    fetchData()
  }, [])

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleSchema),
    mode: 'onTouched',
    defaultValues: {
      vaccinationDate: dayjs().format('YYYY-MM-DD'),
      vaccinationTime: dayjs().add(5, 'minute').format('HH:mm'),
      vaccine_id: undefined,
      capacity: 1,
      age: '',
      user_id: undefined,
      location_id: undefined,
      note: ''
    }
  })

  // ====================================================
  // BACK
  // ====================================================

  const handleBack = () => {
    router.back()
  }

  // ====================================================
  // SUBMIT
  // ====================================================

  const handleCreate = async ({
    vaccinationDate,
    vaccinationTime,
    ...data
  }: ScheduleFormData) => {
    try {
      await createVaccinationScheduleAPI({
        ...data,
        vaccination_date: `${vaccinationDate}T${vaccinationTime}:00`
      })

      toast.success('Tạo lịch tiêm thành công')
      reset()
      router.push('/vaccination-schedules')
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const { field, message } = error.response?.data || {}

        if (field && message) {
          setError(field as keyof ScheduleFormData, {
            type: 'server',
            message
          })

          return
        }
      }

      toast.error('Tạo lịch tiêm thất bại')
    }
  }

  // ====================================================
  // UI
  // ====================================================

  return (
    <Box
      component="main"
      sx={(theme) => ({
        ml: theme.layout.sidebarWidth,
        pt: theme.layout.headerHeight,
        minHeight: `calc(100vh - ${theme.layout.footerHeight})`,
        bgcolor: '#f5f7fb',
        boxSizing: 'border-box'
      })}
    >
      <Box
        sx={{
          width: '100%',
          p: 3,
          boxSizing: 'border-box'
        }}
      >
        <Paper
          variant="outlined"
          sx={{
            width: '100%',
            bgcolor: '#fff',
            borderRadius: 2.5,
            boxShadow: 'none',
            overflow: 'hidden'
          }}
        >
          {/* ================================================= */}
          {/* HEADER */}
          {/* ================================================= */}

          <Box
            sx={{
              px: 3,
              py: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5
            }}
          >
            <IconButton
              onClick={handleBack}
              sx={{
                width: 42,
                height: 42,
                flexShrink: 0,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: '#fff'
              }}
            >
              <ArrowBackOutlinedIcon />
            </IconButton>

            <Box
              sx={{
                width: 44,
                height: 44,
                flexShrink: 0,
                display: {
                  xs: 'none',
                  sm: 'flex'
                },
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 2,
                bgcolor: 'primary.main',
                color: '#fff'
              }}
            >
              <CalendarMonthOutlinedIcon />
            </Box>

            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  lineHeight: 1.25
                }}
              >
                Tạo lịch tiêm chủng
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 0.25
                }}
              >
                Nhập thông tin để tạo lịch tiêm chủng
              </Typography>
            </Box>
          </Box>

          <Divider />

          {/* ================================================= */}
          {/* FORM */}
          {/* ================================================= */}

          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit(handleCreate)}
          >
            <Box
              sx={{
                p: 3,
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  md: 'repeat(2, minmax(0, 1fr))'
                },
                columnGap: 2,
                rowGap: 2
              }}
            >
              {/* ========================================= */}
              {/* DATE */}
              {/* ========================================= */}

              <Controller
                name="vaccinationDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Ngày tiêm"
                    format="DD/MM/YYYY"
                    minDate={dayjs()}
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(value) =>
                      field.onChange(value?.format('YYYY-MM-DD') ?? '')
                    }
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                        error: Boolean(errors.vaccinationDate),
                        helperText: errors.vaccinationDate?.message
                      }
                    }}
                  />
                )}
              />
              <Controller
                name="vaccinationTime"
                control={control}
                render={({ field }) => (
                  <TimePicker
                    label="Giờ tiêm"
                    ampm={false}
                    format="HH:mm"
                    value={
                      field.value ? dayjs(`2000-01-01T${field.value}`) : null
                    }
                    onChange={(value) =>
                      field.onChange(value?.format('HH:mm') ?? '')
                    }
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                        error: Boolean(errors.vaccinationTime),
                        helperText: errors.vaccinationTime?.message
                      }
                    }}
                  />
                )}
              />

              {/* ========================================= */}
              {/* VACCINE */}
              {/* ========================================= */}

              <TextField
                select
                label="Loại vaccine"
                required
                fullWidth
                defaultValue=""
                {...register('vaccine_id', {
                  valueAsNumber: true
                })}
                error={Boolean(errors.vaccine_id)}
                helperText={errors.vaccine_id?.message}
              >
                <MenuItem value="">
                  <em>Chọn vaccine</em>
                </MenuItem>

                {vaccines.map((vaccine) => (
                  <MenuItem key={vaccine.vaccine_id} value={vaccine.vaccine_id}>
                    {vaccine.vaccine_name}
                  </MenuItem>
                ))}
              </TextField>

              {/* ========================================= */}
              {/* CAPACITY */}
              {/* ========================================= */}

              <TextField
                label="Số lượng vaccine"
                required
                fullWidth
                type="number"
                {...register('capacity', {
                  valueAsNumber: true
                })}
                error={Boolean(errors.capacity)}
                helperText={errors.capacity?.message}
                slotProps={{
                  htmlInput: {
                    min: 1,
                    step: 1
                  }
                }}
              />

              {/* ========================================= */}
              {/* AGE */}
              {/* ========================================= */}

              <TextField
                label="Độ tuổi"
                required
                fullWidth
                placeholder="VD: 18 tuổi trở lên"
                {...register('age')}
                error={Boolean(errors.age)}
                helperText={errors.age?.message}
                slotProps={{
                  htmlInput: {
                    maxLength: 100
                  }
                }}
              />

              {/* ========================================= */}
              {/* MEDICAL STAFF */}
              {/* ========================================= */}

              <TextField
                select
                label="Nhân viên y tế"
                required
                fullWidth
                defaultValue=""
                {...register('user_id', {
                  valueAsNumber: true
                })}
                error={Boolean(errors.user_id)}
                helperText={errors.user_id?.message}
              >
                <MenuItem value="">
                  <em>Chọn nhân viên y tế</em>
                </MenuItem>

                {staff.map((user) => (
                  <MenuItem key={user.user_id} value={user.user_id}>
                    {user.fullName}
                  </MenuItem>
                ))}
              </TextField>

              {/* LOCATION */}

              <TextField
                select
                label="Địa điểm tiêm"
                required
                fullWidth
                defaultValue=""
                {...register('location_id', {
                  valueAsNumber: true
                })}
                error={Boolean(errors.location_id)}
                helperText={errors.location_id?.message}
              >
                <MenuItem value="">
                  <em>Chọn địa điểm tiêm</em>
                </MenuItem>

                {locations.map((location) => (
                  <MenuItem
                    key={location.location_id}
                    value={location.location_id}
                  >
                    {location.locationName} - {location.address}
                  </MenuItem>
                ))}
              </TextField>

              {/* ========================================= */}
              {/* NOTE */}
              {/* ========================================= */}

              <TextField
                label="Ghi chú"
                fullWidth
                multiline
                minRows={3}
                maxRows={5}
                placeholder="Nhập ghi chú nếu có..."
                {...register('note')}
                error={Boolean(errors.note)}
                helperText={errors.note?.message}
                slotProps={{
                  htmlInput: {
                    maxLength: 500
                  }
                }}
                sx={{
                  gridColumn: {
                    xs: 'auto',
                    md: '1 / -1'
                  }
                }}
              />
            </Box>

            <Divider />

            {/* ================================================= */}
            {/* ACTION */}
            {/* ================================================= */}

            <Box
              sx={{
                px: 3,
                py: 2,
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: 1.5
              }}
            >
              <Button
                type="button"
                variant="outlined"
                onClick={handleBack}
                disabled={isSubmitting}
                sx={{
                  minWidth: 110,
                  height: 40,
                  textTransform: 'none'
                }}
              >
                Hủy
              </Button>

              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                startIcon={<SaveOutlinedIcon />}
                sx={{
                  minWidth: 140,
                  height: 40,
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                {isSubmitting ? 'Đang lưu...' : 'Lưu'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}

export default ScheduleCreate
