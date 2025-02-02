(function (library) {
  /**
   * creates an internal swap object (including bonds fpr fixed leg and float leg) from input data
   * @param {object} instrument instrument (swap)
   * @memberof library
   * @public
   */
  library.swap = function (instrument) {
    this.phi = library.get_safe_bool(instrument.is_payer) ? -1 : 1;

    this.fixed_rate = instrument.fixed_rate;
    //the fixed leg of the swap
    this.fixed_leg = new library.fixed_income({
      notional: instrument.notional * this.phi,
      notional_exchange: false,
      maturity: instrument.maturity,
      fixed_rate: instrument.fixed_rate,
      tenor: instrument.tenor,
      effective_date: instrument.effective_date,
      calendar: instrument.calendar,
      bdc: instrument.bdc,
      dcc: instrument.dcc,
      adjust_accrual_periods: instrument.adjust_accrual_periods,
    });

    //the floating rate leg of the swap
    this.float_leg = new library.fixed_income({
      notional: -instrument.notional * this.phi,
      notional_exchange: false,
      maturity: instrument.maturity,
      float_spread: instrument.float_spread,
      tenor: instrument.float_tenor,
      effective_date: instrument.effective_date,
      calendar: instrument.calendar,
      bdc: instrument.float_bdc,
      dcc: instrument.float_dcc,
      float_current_rate: instrument.float_current_rate,
      adjust_accrual_periods: instrument.adjust_accrual_periods,
    });
  };
  /**
   * ...
   * @param {object} disc_curve discount curve
   * @param {object} fwd_curve forward curve
   * @returns {number} fair rate
   * @memberof library
   * @public
   */
  library.swap.prototype.fair_rate = function (disc_curve, fwd_curve) {
    //returns fair rate, that is, rate such that swap has zero present value
    var pv_float = this.float_leg.present_value(disc_curve, null, fwd_curve);
    if (0 === pv_float) return 0;
    return (-this.phi * pv_float) / this.annuity(disc_curve);
  };
  /**
   * ...
   * @param {object} disc_curve discount curve
   * @returns {number} annuity
   * @memberof library
   * @public
   */
  library.swap.prototype.annuity = function (disc_curve) {
    //returns always positive annuity regardless of payer/receiver flag
    return this.fixed_leg.annuity(disc_curve) * this.phi;
  };
  /**
   * calculates the present value for internal swap (object)
   * @param {object} disc_curve discount curve
   * @param {object} fwd_curve forward curve
   * @returns {number} present value
   * @memberof library
   * @public
   */
  library.swap.prototype.present_value = function (disc_curve, fwd_curve) {
    var res = 0;
    res += this.fixed_leg.present_value(disc_curve, null, null);
    res += this.float_leg.present_value(disc_curve, null, fwd_curve);
    return res;
  };
  /**
   * ...
   * @param {object} fwd_curve forward curve
   * @returns {object} cash flows
   * @memberof library
   * @public
   */
  library.swap.prototype.get_cash_flows = function (fwd_curve) {
    return {
      fixed_leg: this.fixed_leg.get_cash_flows(),
      float_leg: this.float_leg.get_cash_flows(fwd_curve),
    };
  };

  /**
   * ...
   * @param {object} swap Instrument
   * @param {object} disc_curve discount curve
   * @param {object} fwd_curve forward curve
   * @returns {number} present value
   * @memberof library
   * @public
   */
  library.pricer_swap = function (swap, disc_curve, fwd_curve) {
    var swap_internal = new library.swap(swap);
    return swap_internal.present_value(disc_curve, fwd_curve);
  };
})(this.JsonRisk || module.exports);
