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
import RestartAltOutlinedIcon from '@mui/icons-material/RestartAltOutlined'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'

import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { DatePicker, TimePicker } from '@mui/x-date-pickers'
import { useRouter } from 'next/navigation'
import dayjs from 'dayjs'
import { z } from 'zod'

// ======================================================
// VALIDATION
// ======================================================

const scheduleSchema = z
  .object({
    vaccinationDate: z.string().min(1, 'Vui lòng chọn ngày tiêm'),

    vaccinationTime: z.string().min(1, 'Vui lòng chọn giờ tiêm'),

    vaccine: z.string().min(1, 'Vui lòng chọn vaccine'),

    quantity: z
      .number({
        message: 'Vui lòng nhập số lượng vaccine'
      })
      .int('Số lượng vaccine phải là số nguyên')
      .min(1, 'Số lượng vaccine phải ít nhất là 1')
      .max(1000, 'Số lượng vaccine không được vượt quá 1000'),

    age: z
      .string()
      .trim()
      .min(1, 'Vui lòng nhập độ tuổi')
      .refine((value) => /^\d+$/.test(value), {
        message: 'Độ tuổi phải là số'
      })
      .refine((value) => Number(value) >= 0, {
        message: 'Độ tuổi không được nhỏ hơn 0'
      })
      .refine((value) => Number(value) <= 120, {
        message: 'Độ tuổi không được vượt quá 120 tuổi'
      }),

    medicalStaff: z.string().min(1, 'Vui lòng chọn nhân viên y tế'),

    note: z.string().trim().max(500, 'Ghi chú không được vượt quá 500 ký tự')
  })
  .superRefine((data, ctx) => {
    if (!data.vaccinationDate || !data.vaccinationTime) {
      return
    }

    const vaccinationDateTime = dayjs(
      `${data.vaccinationDate}T${data.vaccinationTime}`
    )

    if (!vaccinationDateTime.isValid()) {
      return
    }

    if (!vaccinationDateTime.isAfter(dayjs())) {
      ctx.addIssue({
        code: 'custom',
        path: ['vaccinationDate'],
        message: 'Ngày và giờ tiêm phải lớn hơn thời gian hiện tại'
      })

      ctx.addIssue({
        code: 'custom',
        path: ['vaccinationTime'],
        message: 'Ngày và giờ tiêm phải lớn hơn thời gian hiện tại'
      })
    }
  })

type ScheduleForm = z.infer<typeof scheduleSchema>

// ======================================================
// DEFAULT VALUES
// ======================================================

const getDefaultValues = (): ScheduleForm => ({
  vaccine: '',

  vaccinationDate: dayjs().format('YYYY-MM-DD'),

  vaccinationTime: dayjs().add(5, 'minute').format('HH:mm'),

  quantity: 1,

  age: '',

  medicalStaff: '',

  note: ''
})

// ======================================================
// COMPONENT
// ======================================================

const Schedule = () => {
  const router = useRouter()

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<ScheduleForm>({
    resolver: zodResolver(scheduleSchema),

    mode: 'onTouched',

    defaultValues: getDefaultValues()
  })

  const note = watch('note') ?? ''

  // ====================================================
  // BACK
  // ====================================================

  const handleBack = () => {
    router.back()
  }

  // ====================================================
  // RESET
  // ====================================================

  const handleReset = () => {
    reset(getDefaultValues())
  }

  // ====================================================
  // SUBMIT
  // ====================================================

  const onSubmit = async (data: ScheduleForm) => {
    const payload = {
      vaccinationDate: data.vaccinationDate,

      vaccinationTime: data.vaccinationTime,

      vaccine: data.vaccine,

      quantity: data.quantity,

      age: data.age,

      medicalStaff: data.medicalStaff,

      note: data.note
    }

    console.log('Schedule data:', payload)

    // TODO:
    // await createSchedule(payload)

    // Sau khi API thành công:
    // router.push('/vaccination-schedules')
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
      {/* ================================================= */}
      {/* FULL CONTENT */}
      {/* ================================================= */}

      <Box
        sx={{
          width: '100%',

          p: 3,

          boxSizing: 'border-box'
        }}
      >
        {/* ================================================= */}
        {/* PAPER FULL WIDTH */}
        {/* ================================================= */}

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
          {/* ============================================= */}
          {/* HEADER */}
          {/* ============================================= */}

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

            {/* ICON */}

            <Box
              sx={{
                width: 42,

                height: 42,

                borderRadius: 2,

                bgcolor: 'primary.main',

                color: 'primary.contrastText',

                display: {
                  xs: 'none',
                  sm: 'flex'
                },

                alignItems: 'center',

                justifyContent: 'center',

                flexShrink: 0
              }}
            >
              <CalendarMonthOutlinedIcon />
            </Box>

            {/* TITLE */}

            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,

                  lineHeight: 1.3
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

          {/* ============================================= */}
          {/* FORM */}
          {/* ============================================= */}

          <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
            {/* =========================================== */}
            {/* FORM CONTENT */}
            {/* =========================================== */}

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

                    onChange={(value) => {
                      field.onChange(value ? value.format('YYYY-MM-DD') : '')
                    }}

                    slotProps={{
                      textField: {
                        fullWidth: true,

                        required: true,

                        onBlur: field.onBlur,

                        error: Boolean(errors.vaccinationDate),

                        helperText: errors.vaccinationDate?.message
                      }
                    }}
                  />
                )}
              />

              {/* ========================================= */}
              {/* TIME */}
              {/* ========================================= */}

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

                    onChange={(value) => {
                      field.onChange(value ? value.format('HH:mm') : '')
                    }}

                    slotProps={{
                      textField: {
                        fullWidth: true,

                        required: true,

                        onBlur: field.onBlur,

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

              <Controller
                name="vaccine"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}

                    select

                    fullWidth

                    required

                    label="Loại vaccine"

                    error={Boolean(errors.vaccine)}

                    helperText={errors.vaccine?.message}
                  >
                    <MenuItem value="">
                      <em>Chọn vaccine</em>
                    </MenuItem>

                    <MenuItem value="influenza">Vaccine cúm</MenuItem>

                    <MenuItem value="hepatitis-b">Vaccine viêm gan B</MenuItem>

                    <MenuItem value="hpv">Vaccine HPV</MenuItem>
                  </TextField>
                )}
              />

              {/* ========================================= */}
              {/* QUANTITY */}
              {/* ========================================= */}

              <Controller
                name="quantity"
                control={control}
                render={({ field }) => (
                  <TextField
                    fullWidth

                    required

                    type="number"

                    label="Số lượng vaccine"

                    value={field.value ?? ''}

                    onBlur={field.onBlur}

                    onChange={(event) => {
                      const value = event.target.value

                      field.onChange(value === '' ? 0 : Number(value))
                    }}

                    error={Boolean(errors.quantity)}

                    helperText={errors.quantity?.message}

                    slotProps={{
                      htmlInput: {
                        min: 1,

                        max: 1000,

                        step: 1
                      }
                    }}
                  />
                )}
              />

              {/* ========================================= */}
              {/* AGE */}
              {/* ========================================= */}

              <Controller
                name="age"
                control={control}
                render={({ field }) => (
                  <TextField
                    fullWidth

                    required

                    type="text"

                    label="Độ tuổi"

                    placeholder="VD: 18"

                    value={field.value}

                    onBlur={field.onBlur}

                    onChange={(event) => {
                      const value = event.target.value
                        .replace(/\D/g, '')
                        .slice(0, 3)

                      field.onChange(value)
                    }}

                    error={Boolean(errors.age)}

                    helperText={errors.age?.message || 'Nhập tuổi từ 0 đến 120'}

                    slotProps={{
                      htmlInput: {
                        maxLength: 3,

                        inputMode: 'numeric'
                      }
                    }}
                  />
                )}
              />

              {/* ========================================= */}
              {/* MEDICAL STAFF */}
              {/* ========================================= */}

              <Controller
                name="medicalStaff"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}

                    select

                    fullWidth

                    required

                    label="Nhân viên y tế"

                    error={Boolean(errors.medicalStaff)}

                    helperText={errors.medicalStaff?.message}
                  >
                    <MenuItem value="">
                      <em>Chọn nhân viên y tế</em>
                    </MenuItem>

                    <MenuItem value="staff-1">Nguyễn Thị Lan</MenuItem>

                    <MenuItem value="staff-2">Trần Văn Minh</MenuItem>

                    <MenuItem value="staff-3">Lê Thị Hoa</MenuItem>
                  </TextField>
                )}
              />

              {/* ========================================= */}
              {/* NOTE */}
              {/* ========================================= */}

              <Controller
                name="note"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}

                    fullWidth

                    multiline

                    minRows={3}

                    maxRows={5}

                    label="Ghi chú"

                    placeholder="Nhập ghi chú nếu có..."

                    error={Boolean(errors.note)}

                    helperText={
                      errors.note?.message || `${note.length}/500 ký tự`
                    }

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
                )}
              />
            </Box>

            {/* =========================================== */}
            {/* DIVIDER */}
            {/* =========================================== */}

            <Divider />

            {/* =========================================== */}
            {/* ACTION */}
            {/* =========================================== */}

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

                startIcon={<RestartAltOutlinedIcon />}

                onClick={handleReset}

                sx={{
                  minWidth: 120,

                  height: 40,

                  textTransform: 'none'
                }}
              >
                Làm mới
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

export default Schedule
