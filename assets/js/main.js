function init() {
	return {
		currency: function (elementName) {
			$('.'+ elementName).text(db.currency);
		},
		rateOptions: function (elementName) {
			let rateOptions = "";
			db.rates.forEach((data) => {
				if (data.type === "combined") {
					rateOptions += `<option data-fixed-period="${data.fixed_period}" data-float-rate="${data.float_value}" value="${data.fixed_value}">${data.label}</option>`
				} else {
					rateOptions += `<option value="${data.value}">${data.label}</option>`
				}
			});

			$('#'+ elementName).html(rateOptions);
		},
		additional: function (elementName) {
			if (db.additional.length === 0) {
				return;
			}

			let field = `<div class="form-group row">
		          <label class="col-sm-2">{{label}}</label>
		          <div class="col-sm-10">{{input}}</div>
		        </div>`;

			let additionalFields = "";
			db.additional.forEach((data) => {
				let inputForm = this.getInput(data.field.type)
					.replace("{{id}}", "additional-"+ data.field.id)
					.replace("{{value}}", 0);

				additionalFields += field
					.replace("{{label}}", data.label)
					.replace("{{input}}", inputForm);
			});

			$('#'+ elementName).html(`<hr class="my-4">
				<h3>Additional Fields</h3><br/>`+ additionalFields);
		},
		getInput: function (inputType) {
			switch (inputType) {
				case "number":
					return `<input type="number" class="form-control" id="{{id}}" value="{{value}}">`;
				case "string":
					return `<input type="text" class="form-control" id="{{id}}" value="{{value}}">`;
				case "currency":
					return `
						<div class="input-group mb-3">
							<div class="input-group-prepend">
								<span class="input-group-text currency-label">${db.currency}</span>
							</div>
							<input type="number" class="form-control" id="{{id}}" value="{{value}}">
						</div>`;
				case "dropdown":
					break;
			}
		}
	}

}

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
		$('#txt-loan-amount').val(0);
		return;
	}

	var parser = new exprEval.Parser();
	parser.consts = {
        property_price: propertyPrice,
        down_payment: downPayment
    };
    const loanAmount = parser.parse(db.formula.loan_amount).evaluate();
    console.log("formula (loan amount) :: "+ parser.parse(db.formula.loan_amount).toString());
	if (isNaN(loanAmount)) {
		$('#txt-loan-amount').val(0);
		return;
	}

	$('#txt-loan-amount').val(loanAmount);
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

