function message(string) {
	$('#top-alert').html(string).slideDown('slow');
	setTimeout(function(){$('#top-alert').slideUp('slow')}, 5000);
}

function toggleTenor(element) {
	$('.btn-option-tenor').removeClass('btn-primary').removeClass('active').addClass('btn-light');
	$(element).removeClass('btn-light').addClass('btn-primary').addClass('active');
}

function toggleRate(element) {
	$('.btn-rate-method').removeClass('btn-primary').removeClass('active').addClass('btn-light');
	$(element).removeClass('btn-light').addClass('btn-primary').addClass('active');	
}

function calculateLoanAmount() {
	let propertyPrice = parseInt($('#txt-property-price').val());
	let downPayment = parseInt($('#txt-down-payment').val());

	if (downPayment > propertyPrice) {
		message("Down payment cannot be higher than property price");
		$('#container-loan-amount').slideUp();
		return;
	}

	let loanAmount = propertyPrice - downPayment;
	if (isNaN(loanAmount)) {
		$('#container-loan-amount').slideUp();
		return;
	}

	$('#txt-loan-amount').val(loanAmount);
	$('#container-loan-amount').slideDown('fast');
}

function hitung() {
	$('#installments').fadeOut("fast");

	const installments = calculator.compute();

	let allRows = "";
	installments.forEach((value) => {
		let rowData;
		rowData = installmentRowTable
			.replace("{{sequence}}", value.sequence_number)
			.replace("{{month_name}}", value.month)
			.replace("{{installment}}", value.installment)
			.replace("{{principal_installment}}", value.principal_installment)
			.replace("{{interest_installment}}", value.interest_installment)
			.replace("{{rate}}", value.rate)
			.replace("{{loan_balance}}", value.loan_balance)

		allRows += rowData;
	});

	let content = installmentTable.replace("{{content}}", allRows);

	$('#installments').html(content + applyNowButton);
	$('#installments').slideDown();
}

// toggle options
$('#btn-option-one-tenor').on('click', () => { toggleTenor($('#btn-option-one-tenor')) });
$('#btn-option-multi-tenor').on('click', () => { toggleTenor($('#btn-option-multi-tenor')); });

// toggle rate
$('#btn-rate-method-flat').on('click', () => { toggleRate($('#btn-rate-method-flat')) });
$('#btn-rate-method-effective').on('click', () => { toggleRate($('#btn-rate-method-effective')); });
$('#btn-rate-method-annuity').on('click', () => { toggleRate($('#btn-rate-method-annuity')); });

// calculate "Loan Amount" responsively
$('#txt-property-price').on('blur', calculateLoanAmount);
$('#txt-down-payment').on('blur', calculateLoanAmount);

