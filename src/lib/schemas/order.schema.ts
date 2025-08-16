import { z } from 'zod'

export const orderFormSchema = z.object({
  contact: z.string().min(1, 'Contact information is required'),
  permitStartDate: z.date({ required_error: 'Permit start date is required' }),
  commodity: z.string().min(1, 'Commodity description is required'),
  loadDims: z.string().min(1, 'Load dimensions are required'),
  lengthFt: z.string().min(1, 'Length (ft) is required'),
  lengthIn: z.string().min(1, 'Length (in) is required'),
  widthFt: z.string().min(1, 'Width (ft) is required'),
  widthIn: z.string().min(1, 'Width (in) is required'),
  heightFt: z.string().min(1, 'Height (ft) is required'),
  heightIn: z.string().min(1, 'Height (in) is required'),
  rearOverhangFt: z.string().min(1, 'Rear overhang (ft) is required'),
  rearOverhangIn: z.string().min(1, 'Rear overhang (in) is required'),
  makeModel: z.string().optional(),
  serial: z.string().optional(),
  singleMultiple: z.string().optional(),
  legalWeight: z.enum(['yes', 'no']),
  originAddress: z.string().min(1, 'Origin address is required'),
  destinationAddress: z.string().min(1, 'Destination address is required'),
  files: z.array(z.instanceof(File)).optional(),
  stops: z.array(z.string()).optional(),
})

export type OrderFormData = z.infer<typeof orderFormSchema>

export const orderFormDefaultValues: OrderFormData = {
  contact: '',
  permitStartDate: new Date(),
  commodity: '',
  loadDims: '',
  lengthFt: '',
  lengthIn: '',
  widthFt: '',
  widthIn: '',
  heightFt: '',
  heightIn: '',
  rearOverhangFt: '',
  rearOverhangIn: '',
  makeModel: '',
  serial: '',
  singleMultiple: '',
  legalWeight: 'yes',
  originAddress: '',
  destinationAddress: '',
  files: [],
  stops: [], // Add default empty array for stops
}
