import React, { useState, useEffect } from "react";

export default function CountdownTimer({ selectedValues }) {
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    let totalSeconds = 0;

    if (selectedValues.timerType === "countdown-to-date") {
      const target = new Date(`${selectedValues.countdownDate}T${selectedValues.countdownTime}`);
      totalSeconds = Math.max(0, Math.floor((target - new Date()) / 1000));
    } else if (selectedValues.timerType === "fixed-minutes") {
      totalSeconds =
        (Number(selectedValues.timerDays) * 24 * 60 * 60 || 0) +
        (Number(selectedValues.timerHour) * 60 * 60 || 0) +
        (Number(selectedValues.timerMinutes) * 60 || 0) +
        (Number(selectedValues.timerSeconds) || 0);
    }

    setRemainingTime(totalSeconds);
  }, [
    selectedValues.timerType,
    selectedValues.countdownDate,
    selectedValues.countdownTime,
    selectedValues.timerDays,
    selectedValues.timerHour,
    selectedValues.timerMinutes,
    selectedValues.timerSeconds,
  ]);

  useEffect(() => {
    if (remainingTime <= 0) return;
    const interval = setInterval(() => {
      setRemainingTime((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [remainingTime]);

  const formatTime = (time) => {
    const days = Math.floor(time / (24 * 3600));
    const hours = Math.floor((time % (24 * 3600)) / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };


  return (
    <div className="timer-preview">
      <p>
        <span>{selectedValues.announcementText} </span>
        {selectedValues.counterVisibilty !== "hide" && (
          <span>{formatTime(remainingTime)}</span>
        )}
      </p>
    </div>
  );
}
