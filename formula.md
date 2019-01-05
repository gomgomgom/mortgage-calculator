property price
down payment

loan_amount
period_time			// in year
interest_rate

// sample fixed rate
interest_rate: {
	rate: 3.00%
}


// sample combined rate
interest_rate: {
	fixed_rate: 5.00%
	fixed_period: 3 year
	float_rate: 12.50%
	float_period: 0
}




~~~~~~~~~~~~~~~~~~~~~~~
FORMULA
~~~~~~~~~~~~~~~~~~~~~~~
Case Fixed Rate :
- loan_amount = 270.000.000
- rate = 3%
- period_time = 10 years


// Fixed Rate
Formula :: (loan_amount + (loan_amount x rate x period_time)) / (period_time x 12 months)

(270.000.000 + (270.000.000 x 3% x 10)) / (10 x 12)
(270.000.000 + (81.000.000)) / 120
351.000.000 / 120
=> 2.925.000


// Combined Rate
Formula :: (
	loan_amount + 
	(loan_amount x fixed_rate x fixed_period) + 
	(loan_amount x float_rate x (period_time - fixed_period))
) / (period_time x 12 months)

(270.000.000 + (270.000.000 x 5.00% x 3) + (270.000.000 x 12.50% x (10 - 3)) ) / (10 x 12)
(270.000.000 + 40.500.000 + 236.250.000) / 120
546.750.000 / 120
=> 4.556.250


