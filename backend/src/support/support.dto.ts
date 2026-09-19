import { IsEmail, IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator'

export const SUPPORT_CATEGORIES = [
  'Travel Assistance & Hostel Booking',
  'Problem Statement Clarification',
  'Sponsorship & Bounty Inquiry',
  'Other / General Support',
]

export const FEEDBACK_CATEGORIES = ['General', 'Venue & Logistics', 'Judging & Rounds', 'Suggestion']

export class SupportInquiryDto {
  @IsEmail({}, { message: 'A valid email is required.' })
  email: string

  /** Display name of the sender (support page form). */
  @IsOptional()
  @IsString()
  @MaxLength(80, { message: 'Name must be at most 80 characters.' })
  name?: string

  /** Optional on the dedicated /support page — defaults to General. */
  @IsOptional()
  @IsIn([...SUPPORT_CATEGORIES, ...FEEDBACK_CATEGORIES, 'General'], {
    message: 'Unknown inquiry category.',
  })
  category?: string

  @IsString()
  @MinLength(10, { message: 'Message must be at least 10 characters.' })
  @MaxLength(2000, { message: 'Message must be at most 2000 characters.' })
  message: string

  /** 'participant' (default) = support query, 'feedback' = experience feedback */
  @IsOptional()
  @IsIn(['participant', 'feedback'])
  kind?: 'participant' | 'feedback'

  /** 1–5, feedback only */
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number
}
