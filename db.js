const db = {
	currency: "$",
	rates: [
		{
			type: "fixed", // fixed / combined (fixed & float)
			value: 3.00, // decimal
			label: "3.00%" // string
		},
		{
			type: "fixed",
			value: 4.50,
			label: "4.50%"
		},
		{
			// special for `combined` type
			// there are `fixed_value` and `float_value`
			// as replacement for `value`
			// and additional field `fixed_period` and `float_period`
			type: "combined",
			fixed_value: 3.00,
			fixed_period: 3,
			float_value: 12.50,
			float_period: 0, // means the rest of period
			label: "3.00% fixed 3 years (12.50% float assumption)"
		},
		{
			type: "combined",
			fixed_value: 5.00,
			fixed_period: 3,
			float_value: 12.50,
			float_period: 0, // means the rest of period
			label: "5.00% fixed 3 years (12.50% float assumption)"
		}
	],
	formula: {
		loan_amount: "property_price - down_payment",
		fixed: "(loan_amount + (((loan_amount * rate) / 100) * period_time)) / (period_time * 12)",
		combined: `(
			loan_amount + 
			(((loan_amount * fixed_rate) / 100) * fixed_period) + 
			(((loan_amount * float_rate) / 100) * (period_time - fixed_period))
		) / (period_time * 12)`
	},
	additional: [
		{
			label: "Age (year)",
			field: {
				id: "txt-age",
				type: "number", // number | string | dropdown | currency
			}
		},
		{
			label: "Another Loan<br/>(fill this if exist)",
			field: {
				id: "txt-another-loan",
				type: "currency", // number | string | dropdown | currency
			}
		}
	]
}