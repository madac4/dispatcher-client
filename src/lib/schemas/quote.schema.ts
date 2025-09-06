import { z } from 'zod'

export const quoteFormSchema = z.object({
	// Load Dimensions
	lengthFt: z.string().min(1, 'Length (ft) is required'),
	lengthIn: z.string().min(1, 'Length (in) is required'),
	widthFt: z.string().min(1, 'Width (ft) is required'),
	widthIn: z.string().min(1, 'Width (in) is required'),
	heightFt: z.string().min(1, 'Height (ft) is required'),
	heightIn: z.string().min(1, 'Height (in) is required'),
	weight: z.string().min(1, 'Weight is required'),

	// Route Information
	originAddress: z.string().min(1, 'Origin address is required'),
	destinationAddress: z.string().min(1, 'Destination address is required'),
	stops: z.array(z.string()).optional(),
})

export type QuoteFormData = z.infer<typeof quoteFormSchema>

export const quoteFormDefaultValues: QuoteFormData = {
	lengthFt: '',
	lengthIn: '',
	widthFt: '',
	widthIn: '',
	heightFt: '',
	heightIn: '',
	weight: '',
	originAddress: '',
	destinationAddress: '',
	stops: [],
}
