import React, { forwardRef } from "react";
import DatePicker from "react-datepicker";
import styles from "./CustomDatePicker.module.scss";

const CustomDatePicker = ({ value, changed, label }) => {
  const CustomInput = forwardRef(({ value, onClick }, ref) => (
    <input
      className={styles.datePicker}
      onClick={onClick}
      value={value}
      ref={ref}
    />
  ));
  return (
    <>
      <label>{label}</label>
      <DatePicker
        selected={value}
        onChange={(date) => {
          console.log(date);
          changed(date);
        }}
        customInput={<CustomInput />}
      />
    </>
  );
};

export default CustomDatePicker;
