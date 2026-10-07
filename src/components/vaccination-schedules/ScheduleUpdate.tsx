'use client'

import {
  Box,
  Button,
  Divider,
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
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'
import dayjs from 'dayjs'
import { z } from 'zod'

import {
  getAllVaccineAPI,
  getVaccinationStaffAPI,
  getVaccinationLocationAPI,
  getVaccinationScheduleByIdAPI,
  updateVaccinationScheduleAPI,
  type Vaccine,
  type VaccinationStaff,
  type VaccinationLocation
} from '@/services/vaccination-schedule.service'

// ======================================================
// PROPS
// ======================================================

type ScheduleUpdateProps = {
  id: string
}

// ======================================================
// VALIDATION
// ======================================================

const scheduleSchema = z.object({
  vaccinationDate: z.string().min(1, 'Vui lòng chọn ngày tiêm'),

  vaccinationTime: z.string().min(1, 'Vui lòng chọn giờ tiêm'),

  vaccine_id: z
    .number({ message: 'Vui lòng chọn vaccine' })
    .min(1, 'Vui lòng chọn vaccine'),

  capacity: z
    .number({ message: 'Vui lòng nhập số lượng' })
    .int('Số lượng phải là số nguyên')
    .min(1, 'Số lượng phải lớn hơn 0'),

  age: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập độ tuổi')
    .max(100, 'Độ tuổi không được vượt quá 100 ký tự'),

  user_id: z
    .number({ message: 'Vui lòng chọn nhân viên y tế' })
    .min(1, 'Vui lòng chọn nhân viên y tế'),

  location_id: z
    .number({ message: 'Vui lòng chọn địa điểm tiêm' })
    .min(1, 'Vui lòng chọn địa điểm tiêm'),

  note: z.string().trim().max(500, 'Ghi chú không được vượt quá 500 ký tự')
})

type ScheduleFormData = z.infer<typeof scheduleSchema>

// ======================================================
// COMPONENT
// ======================================================

const ScheduleUpdate = ({ id }: ScheduleUpdateProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentPage = searchParams.get('currentPage') || '1'
  const scheduleId = Number(id)

  const [vaccines, setVaccines] = useState<Vaccine[]>([])
  const [staff, setStaff] = useState<VaccinationStaff[]>([])
  const [locations, setLocations] = useState<VaccinationLocation[]>([])
  const [loading, setLoading] = useState(true)

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      vaccinationDate: '',
      vaccinationTime: '',
      vaccine_id: undefined,
      capacity: 1,
      age: '',
      user_id: undefined,
      location_id: undefined,
      note: ''
    }
  })

  // ====================================================
  // LOAD DATA
  // ====================================================

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vaccinesData, staffData, locationData, schedule] =
          await Promise.all([
            getAllVaccineAPI(),
            getVaccinationStaffAPI(),
            getVaccinationLocationAPI(),
            getVaccinationScheduleByIdAPI(scheduleId)
          ])
        setVaccines(vaccinesData)
        setStaff(staffData)
        setLocations(locationData)

        reset({
          vaccinationDate: dayjs(schedule.vaccination_date).format(
            'YYYY-MM-DD'
          ),
          vaccinationTime: dayjs(schedule.vaccination_date).format('HH:mm'),
          vaccine_id: Number(schedule.vaccine_id),
          capacity: Number(schedule.capacity),
          age: schedule.age,
          user_id: Number(schedule.user_id),
          location_id: Number(schedule.location_id),
          note: schedule.note ?? ''
        })
      } catch (error) {
        console.error('Lỗi lấy thông tin lịch tiêm:', error)
        toast.error('Không thể tải thông tin lịch tiêm')
      } finally {
        setLoading(false)
      }
    }

    if (scheduleId) {
      fetchData()
    }
  }, [scheduleId, reset])
  // ====================================================
  // BACK
  // ====================================================

  const handleBack = () => {
    router.push(`/vaccination-schedules?page=${currentPage}`)
  }
  // ====================================================
  // UPDATE
  // ====================================================

  const handleUpdate = async ({
    vaccinationDate,
    vaccinationTime,
    ...data
  }: ScheduleFormData) => {
    try {
      await updateVaccinationScheduleAPI(scheduleId, {
        ...data,
        vaccination_date: `${vaccinationDate}T${vaccinationTime}:00`
      })

      toast.success('Cập nhật lịch tiêm thành công')
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

      toast.error('Cập nhật lịch tiêm thất bại')
    }
  }

  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {
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
        <Box sx={{ p: 3 }}>
          <Typography>Đang tải thông tin lịch tiêm...</Typography>
        </Box>
      </Box>
    )
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
          {/* HEADER */}

          <Box
            sx={{
              px: 3,
              py: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5
            }}
          >
            <Button
              type="button"
              onClick={handleBack}
              color="inherit"
              sx={{
                minWidth: 42,
                width: 42,
                height: 42,
                p: 0,
                flexShrink: 0,
                borderRadius: '50%',
                border: '1px solid',
                borderColor: 'divider',
                color: 'text.secondary'
              }}
            >
              <ArrowBackOutlinedIcon />
            </Button>

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
                Chỉnh sửa lịch tiêm chủng
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.25 }}
              >
                Cập nhật thông tin lịch tiêm chủng
              </Typography>
            </Box>
          </Box>

          <Divider />

          {/* FORM */}

          <Box
            component="form"
            onSubmit={handleSubmit(handleUpdate)}
            noValidate
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
              {/* DATE */}

              <Controller
                name="vaccinationDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Ngày tiêm"
                    format="DD/MM/YYYY"
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

              {/* TIME */}

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

              {/* VACCINE */}

              <Controller
                name="vaccine_id"
                control={control}
                render={({ field }) => (
                  <TextField
                    select
                    fullWidth
                    required
                    label="Loại vaccine"
                    value={field.value ?? ''}
                    onChange={(event) =>
                      field.onChange(Number(event.target.value))
                    }
                    error={Boolean(errors.vaccine_id)}
                    helperText={errors.vaccine_id?.message}
                  >
                    <MenuItem value="">
                      <em>Chọn loại vaccine</em>
                    </MenuItem>

                    {vaccines.map((vaccine) => (
                      <MenuItem
                        key={vaccine.vaccine_id}
                        value={vaccine.vaccine_id}
                      >
                        {vaccine.vaccine_name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />

              {/* CAPACITY */}

              <TextField
                fullWidth
                required
                type="number"
                label="Số lượng vaccine"
                {...register('capacity', {
                  valueAsNumber: true
                })}
                error={Boolean(errors.capacity)}
                helperText={errors.capacity?.message}
                slotProps={{
                  htmlInput: {
                    min: 1
                  }
                }}
              />

              {/* AGE */}

              <TextField
                fullWidth
                required
                label="Độ tuổi"
                placeholder="Ví dụ: 18 tuổi trở lên"
                {...register('age')}
                error={Boolean(errors.age)}
                helperText={errors.age?.message}
              />

              {/* STAFF */}

              <Controller
                name="user_id"
                control={control}
                render={({ field }) => (
                  <TextField
                    select
                    fullWidth
                    required
                    label="Nhân viên y tế"
                    value={field.value ?? ''}
                    onChange={(event) =>
                      field.onChange(Number(event.target.value))
                    }
                    error={Boolean(errors.user_id)}
                    helperText={errors.user_id?.message}
                  >
                    <MenuItem value="">
                      <em>Chọn nhân viên y tế</em>
                    </MenuItem>

                    {staff.map((item) => (
                      <MenuItem key={item.user_id} value={Number(item.user_id)}>
                        {item.fullName}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
              <Controller
                name="location_id"
                control={control}
                render={({ field }) => (
                  <TextField
                    select
                    fullWidth
                    required
                    label="Địa điểm tiêm"
                    value={field.value ?? ''}
                    onChange={(event) =>
                      field.onChange(Number(event.target.value))
                    }
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
                )}
              />

              {/* NOTE */}

              <TextField
                fullWidth
                multiline
                minRows={4}
                label="Ghi chú"
                placeholder="Nhập ghi chú..."
                {...register('note')}
                error={Boolean(errors.note)}
                helperText={errors.note?.message}
                sx={{
                  gridColumn: {
                    xs: 'auto',
                    md: '1 / -1'
                  }
                }}
              />
            </Box>

            <Divider />

            {/* ACTIONS */}

            <Box
              sx={{
                px: 3,
                py: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: 1.5
              }}
            >
              <Button
                type="button"
                variant="outlined"
                onClick={handleBack}
                disabled={isSubmitting}
                sx={{
                  minWidth: 120,
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
                {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}

export default ScheduleUpdate
