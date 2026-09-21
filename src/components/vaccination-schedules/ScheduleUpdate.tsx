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

import { useRouter } from 'next/navigation'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// ======================================================
// TYPES
// ======================================================

type ScheduleStatus = 'upcoming' | 'full' | 'completed'

type Schedule = {
  id: number
  vaccinationDate: string
  vaccinationTime: string
  vaccine: string
  age: string
  quantity: number
  registered: number
  medicalStaff: string
  status: ScheduleStatus
}

type ScheduleUpdateProps = {
  id: string
}

type ScheduleUpdateFormProps = {
  schedule: Schedule
}

// ======================================================
// MOCK DATA
// Sau này thay bằng API
// ======================================================

const schedules: Schedule[] = [
  {
    id: 1,
    vaccinationDate: '2026-09-16',
    vaccinationTime: '14:00',
    vaccine: 'Gardasil 9',
    age: '18',
    quantity: 30,
    registered: 18,
    medicalStaff: 'BS. Nguyễn Văn A',
    status: 'upcoming'
  },
  {
    id: 2,
    vaccinationDate: '2026-09-18',
    vaccinationTime: '08:00',
    vaccine: 'Influvac Tetra',
    age: '25',
    quantity: 20,
    registered: 20,
    medicalStaff: 'BS. Trần Văn B',
    status: 'full'
  },
  {
    id: 3,
    vaccinationDate: '2026-09-20',
    vaccinationTime: '09:30',
    vaccine: 'Prevenar 13',
    age: '60',
    quantity: 25,
    registered: 10,
    medicalStaff: 'BS. Lê Thị C',
    status: 'upcoming'
  },
  {
    id: 4,
    vaccinationDate: '2026-09-22',
    vaccinationTime: '13:30',
    vaccine: 'Gardasil 9',
    age: '20',
    quantity: 25,
    registered: 15,
    medicalStaff: 'BS. Nguyễn Văn A',
    status: 'upcoming'
  },
  {
    id: 5,
    vaccinationDate: '2026-09-25',
    vaccinationTime: '08:30',
    vaccine: 'Influvac Tetra',
    age: '30',
    quantity: 30,
    registered: 12,
    medicalStaff: 'BS. Trần Văn B',
    status: 'upcoming'
  },
  {
    id: 6,
    vaccinationDate: '2026-09-27',
    vaccinationTime: '10:00',
    vaccine: 'Prevenar 13',
    age: '65',
    quantity: 20,
    registered: 20,
    medicalStaff: 'BS. Lê Thị C',
    status: 'full'
  },
  {
    id: 7,
    vaccinationDate: '2026-09-29',
    vaccinationTime: '15:00',
    vaccine: 'Gardasil 9',
    age: '21',
    quantity: 35,
    registered: 8,
    medicalStaff: 'BS. Nguyễn Văn A',
    status: 'upcoming'
  },
  {
    id: 8,
    vaccinationDate: '2026-10-01',
    vaccinationTime: '07:30',
    vaccine: 'Influvac Tetra',
    age: '40',
    quantity: 20,
    registered: 9,
    medicalStaff: 'BS. Trần Văn B',
    status: 'upcoming'
  },
  {
    id: 9,
    vaccinationDate: '2026-10-03',
    vaccinationTime: '09:00',
    vaccine: 'Prevenar 13',
    age: '55',
    quantity: 30,
    registered: 14,
    medicalStaff: 'BS. Lê Thị C',
    status: 'upcoming'
  },
  {
    id: 10,
    vaccinationDate: '2026-10-05',
    vaccinationTime: '14:30',
    vaccine: 'Gardasil 9',
    age: '24',
    quantity: 25,
    registered: 11,
    medicalStaff: 'BS. Nguyễn Văn A',
    status: 'upcoming'
  },
  {
    id: 11,
    vaccinationDate: '2026-10-08',
    vaccinationTime: '08:00',
    vaccine: 'Influvac Tetra',
    age: '35',
    quantity: 25,
    registered: 6,
    medicalStaff: 'BS. Trần Văn B',
    status: 'upcoming'
  },
  {
    id: 12,
    vaccinationDate: '2026-10-10',
    vaccinationTime: '10:30',
    vaccine: 'Prevenar 13',
    age: '62',
    quantity: 20,
    registered: 7,
    medicalStaff: 'BS. Lê Thị C',
    status: 'upcoming'
  },
  {
    id: 13,
    vaccinationDate: '2026-10-12',
    vaccinationTime: '09:00',
    vaccine: 'Gardasil 9',
    age: '19',
    quantity: 30,
    registered: 14,
    medicalStaff: 'BS. Nguyễn Văn A',
    status: 'upcoming'
  },
  {
    id: 14,
    vaccinationDate: '2026-10-15',
    vaccinationTime: '14:30',
    vaccine: 'Influvac Tetra',
    age: '45',
    quantity: 25,
    registered: 11,
    medicalStaff: 'BS. Trần Văn B',
    status: 'upcoming'
  },
  {
    id: 15,
    vaccinationDate: '2026-10-18',
    vaccinationTime: '08:00',
    vaccine: 'Prevenar 13',
    age: '58',
    quantity: 25,
    registered: 6,
    medicalStaff: 'BS. Lê Thị C',
    status: 'upcoming'
  },
  {
    id: 16,
    vaccinationDate: '2026-10-20',
    vaccinationTime: '10:30',
    vaccine: 'Gardasil 9',
    age: '26',
    quantity: 20,
    registered: 7,
    medicalStaff: 'BS. Nguyễn Văn A',
    status: 'upcoming'
  }
]

// ======================================================
// MAIN COMPONENT
// ======================================================

const ScheduleUpdate = ({ id }: ScheduleUpdateProps) => {
  const router = useRouter()

  const scheduleId = Number(id)

  const schedule = schedules.find((item) => item.id === scheduleId)

  // ====================================================
  // NOT FOUND
  // ====================================================

  if (!schedule) {
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
            px: 3,
            py: 3
          }}
        >
          <Paper
            variant="outlined"
            sx={{
              width: '100%',
              maxWidth: 600,
              p: 4,
              borderRadius: 2.5,
              boxShadow: 'none',
              textAlign: 'center'
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600
              }}
            >
              Không tìm thấy lịch tiêm
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 1,
                mb: 3
              }}
            >
              Không tìm thấy lịch tiêm có mã #{id}.
            </Typography>

            <Button
              variant="contained"
              onClick={() => router.push('/vaccination-schedules')}
              sx={{
                textTransform: 'none'
              }}
            >
              Quay lại danh sách
            </Button>
          </Paper>
        </Box>
      </Box>
    )
  }

  return <ScheduleUpdateForm key={schedule.id} schedule={schedule} />
}

// ======================================================
// FORM COMPONENT
// ======================================================

const ScheduleUpdateForm = ({ schedule }: ScheduleUpdateFormProps) => {
  const router = useRouter()

  const registered = schedule.registered

  // ====================================================
  // ZOD SCHEMA
  // ====================================================

  const schema = z.object({
    vaccinationDate: z.string().min(1, 'Vui lòng chọn ngày tiêm'),

    vaccinationTime: z.string().min(1, 'Vui lòng chọn giờ tiêm'),

    vaccine: z.string().min(1, 'Vui lòng chọn loại vaccine'),

    quantity: z
      .string()
      .min(1, 'Vui lòng nhập số lượng vaccine')
      .refine(
        (value) => {
          if (!value) return true

          const quantity = Number(value)

          return Number.isInteger(quantity) && quantity >= 1
        },
        {
          message: 'Số lượng phải là số nguyên lớn hơn 0'
        }
      )
      .refine(
        (value) => {
          if (!value) return true

          return Number(value) <= 500
        },
        {
          message: 'Số lượng không được vượt quá 500'
        }
      )
      .refine(
        (value) => {
          if (!value) return true

          return Number(value) >= registered
        },
        {
          message: `Số lượng không được nhỏ hơn số người đã đăng ký (${registered})`
        }
      ),

    age: z
      .string()
      .min(1, 'Vui lòng nhập độ tuổi')
      .refine(
        (value) => {
          if (!value) return true

          const age = Number(value)

          return Number.isInteger(age)
        },
        {
          message: 'Độ tuổi phải là số nguyên'
        }
      )
      .refine(
        (value) => {
          if (!value) return true

          const age = Number(value)

          return age >= 0 && age <= 120
        },
        {
          message: 'Độ tuổi phải từ 0 đến 120'
        }
      ),

    medicalStaff: z.string().min(1, 'Vui lòng chọn nhân viên y tế'),

    status: z.enum(['upcoming', 'full', 'completed'])
  })

  type FormValues = z.infer<typeof schema>

  // ====================================================
  // REACT HOOK FORM
  // ====================================================

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),

    defaultValues: {
      vaccinationDate: schedule.vaccinationDate,

      vaccinationTime: schedule.vaccinationTime,

      vaccine: schedule.vaccine,

      quantity: String(schedule.quantity),

      age: schedule.age,

      medicalStaff: schedule.medicalStaff,

      status: schedule.status
    }
  })

  // ====================================================
  // BACK
  // ====================================================

  const handleBack = () => {
    router.push('/vaccination-schedules')
  }

  // ====================================================
  // SUBMIT
  // ====================================================

  const onSubmit = (data: FormValues) => {
    const payload = {
      id: schedule.id,

      vaccinationDate: data.vaccinationDate,

      vaccinationTime: data.vaccinationTime,

      vaccine: data.vaccine,

      quantity: Number(data.quantity),

      age: Number(data.age),

      registered: schedule.registered,

      medicalStaff: data.medicalStaff,

      status: data.status
    }

    console.log('UPDATE VACCINATION SCHEDULE:', payload)

    // TODO:
    // Gọi API update ở đây

    router.push('/vaccination-schedules')
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
      {/* PAGE CONTENT */}
      <Box
        sx={{
          width: '100%',
          p: 3,
          boxSizing: 'border-box'
        }}
      >
        {/* CARD */}
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
            {/* BACK */}
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

            {/* ICON */}
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

            {/* TITLE */}
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
                sx={{
                  mt: 0.25
                }}
              >
                Cập nhật thông tin lịch tiêm chủng
              </Typography>
            </Box>
          </Box>

          <Divider />

          {/* FORM */}
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* FORM FIELDS */}
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
              <TextField
                fullWidth
                required
                type="date"
                label="Ngày tiêm"
                {...register('vaccinationDate')}
                error={Boolean(errors.vaccinationDate)}
                helperText={errors.vaccinationDate?.message}
                slotProps={{
                  inputLabel: {
                    shrink: true
                  }
                }}
              />

              {/* TIME */}
              <TextField
                fullWidth
                required
                type="time"
                label="Giờ tiêm"
                {...register('vaccinationTime')}
                error={Boolean(errors.vaccinationTime)}
                helperText={errors.vaccinationTime?.message}
                slotProps={{
                  inputLabel: {
                    shrink: true
                  }
                }}
              />

              {/* VACCINE */}
              <TextField
                select
                fullWidth
                required
                label="Loại vaccine"
                defaultValue={schedule.vaccine}
                {...register('vaccine')}
                error={Boolean(errors.vaccine)}
                helperText={errors.vaccine?.message}
              >
                <MenuItem value="">Chọn loại vaccine</MenuItem>

                <MenuItem value="Gardasil 9">Gardasil 9</MenuItem>

                <MenuItem value="Influvac Tetra">Influvac Tetra</MenuItem>

                <MenuItem value="Prevenar 13">Prevenar 13</MenuItem>
              </TextField>

              {/* QUANTITY */}
              <TextField
                fullWidth
                required
                type="number"
                label="Số lượng vaccine"
                {...register('quantity')}
                error={Boolean(errors.quantity)}
                helperText={
                  errors.quantity?.message ||
                  `Đã có ${registered} người đăng ký`
                }
                slotProps={{
                  htmlInput: {
                    min: 1,
                    max: 500
                  }
                }}
              />

              {/* AGE */}
              <TextField
                fullWidth
                required
                type="number"
                label="Độ tuổi"
                placeholder="Độ tuổi"
                {...register('age')}
                error={Boolean(errors.age)}
                helperText={errors.age?.message || 'Nhập tuổi từ 0 đến 120'}
                slotProps={{
                  htmlInput: {
                    min: 0,
                    max: 120
                  }
                }}
              />

              {/* MEDICAL STAFF */}
              <TextField
                select
                fullWidth
                required
                label="Nhân viên y tế"
                defaultValue={schedule.medicalStaff}
                {...register('medicalStaff')}
                error={Boolean(errors.medicalStaff)}
                helperText={errors.medicalStaff?.message}
              >
                <MenuItem value="">Chọn nhân viên y tế</MenuItem>

                <MenuItem value="BS. Nguyễn Văn A">BS. Nguyễn Văn A</MenuItem>

                <MenuItem value="BS. Trần Văn B">BS. Trần Văn B</MenuItem>

                <MenuItem value="BS. Lê Thị C">BS. Lê Thị C</MenuItem>
              </TextField>

              {/* STATUS */}
              <TextField
                select
                fullWidth
                required
                label="Trạng thái"
                defaultValue={schedule.status}
                {...register('status')}
                error={Boolean(errors.status)}
                helperText={errors.status?.message}
                sx={{
                  gridColumn: {
                    xs: 'auto',
                    md: '1 / -1'
                  }
                }}
              >
                <MenuItem value="upcoming">Sắp diễn ra</MenuItem>

                <MenuItem value="full">Đã đủ</MenuItem>

                <MenuItem value="completed">Đã hoàn thành</MenuItem>
              </TextField>
            </Box>

            {/* DIVIDER */}
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
                {isSubmitting ? 'Đang lưu...' : 'Lưu'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}

export default ScheduleUpdate
