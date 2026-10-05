import { z } from 'zod'

export const leadSchema = z.object({
  nombre: z.string().min(1, 'Requerido').max(100),
  apellido: z.string().min(1, 'Requerido').max(100),
  email_empresa: z
    .string()
    .email('Email inválido')
    .max(255)
    .transform((v) => v.toLowerCase().trim()),
  empresa: z.string().min(1, 'Requerido').max(200),
  cargo: z.string().max(200).optional().nullable(),
  tamano_equipo: z.string().max(100).optional().nullable(),
  acepta_comunicaciones: z.boolean().default(false),
  utm_source: z.string().max(200).optional().nullable(),
  utm_medium: z.string().max(200).optional().nullable(),
  utm_campaign: z.string().max(200).optional().nullable(),
  session_id: z.string().max(100).optional().nullable(),
})

export type LeadInput = z.input<typeof leadSchema>
export type Lead = z.output<typeof leadSchema>
