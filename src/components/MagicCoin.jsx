import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { gsap } from "gsap";
import Chart from "chart.js/auto";
// import annotationPlugin from "chartjs-plugin-annotation";
//import { useNavigate } from "react-router-dom"; // Import useNavigate
//import "../../assets/scss/coin.css";
import "../css/coin.css";
// Chart.register(annotationPlugin);

const formatNumber = (num) => {
  if (num > 9999999 && num <= 999999999)
    return `${(num / 1000000).toFixed(1)}M`;
  else if (num > 999999999 && num <= 9999999999)
    return `${(num / 1000000000).toFixed(2)}B`;
  else if (num > 9999999999) return `${(num / 1000000000).toFixed(1)}B`;
  else return `${(num / 1000000).toFixed(2)}M`;
};

const data = [
  { Column1: 52309221.48, date: "2024-07-13T00:00:00" },
  { Column1: 72483127.56, date: "2024-07-14T00:00:00" },
  { Column1: 113948327.76, date: "2024-07-15T00:00:00" },
  { Column1: 1898544.98, date: "2024-07-16T00:00:00" },
  { Column1: 26443298.68, date: "2024-07-17T00:00:00" },
  { Column1: 52322910.3, date: "2024-07-18T00:00:00" },
  { Column1: 9438553.8, date: "2024-07-19T00:00:00" },
  { Column1: 92089517.35, date: "2024-07-20T00:00:00" },
  { Column1: 72203211.88, date: "2024-07-21T00:00:00" },
  { Column1: 47196000.4, date: "2024-07-22T00:00:00" },
];

const MagicCoin = ({ number }) => {
  const coinRef = useRef(null);
  const textRef = useRef(null);
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const animationRef = useRef(null);
  const [isChartVisible, setIsChartVisible] = useState(false);
  //const navigate = useNavigate(); // Initialize navigate

  const startAnimation = () => {
    animationRef.current = gsap.to(coinRef.current, {
      y: -20,
      repeat: -1,
      yoyo: true,
      duration: 2,
      ease: "power1.inOut",
      delay: 2,
    });
    gsap.fromTo(
      textRef.current,
      { scale: 1 },
      {
        scale: 1.1,
        repeat: -1,
        yoyo: true,
        duration: 2,
        delay: 2,
        ease: "power1.inOut",
      }
    );
  };

  useEffect(() => {
    startAnimation();

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, []);

  useEffect(() => {
    if (isChartVisible && chartRef.current) {
      const ctx = chartRef.current.getContext("2d");

      const totalValue = data.reduce((sum, item) => sum + item.Column1, 0);

      chartInstanceRef.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: data.map((d) =>
            new Date(d.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })
          ),
          datasets: [
            {
              label: "Last 10 Day SPCM Revenue Savings (Tomans)",
              data: data.map((d) => d.Column1),
              borderColor: "#eacb67",
              backgroundColor: "rgba(234, 203, 103, 0.2)",
              borderWidth: 2,
              tension: 0.4,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: "Date",
                color: "#eacb67",
              },
              ticks: {
                color: "#eacb67",
              },
            },
            y: {
              display: true,
              title: {
                display: true,
                text: "Value",
                color: "#eacb67",
              },
              ticks: {
                color: "#eacb67",
                callback: function (value) {
                  return formatNumber(value);
                },
              },
            },
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function (context) {
                  return formatNumber(context.raw);
                },
              },
            },
            // annotation: {
            //   annotations: {
            //     sum: {
            //       type: "label",
            //       xValue: data.length - 2,
            //       yValue: totalValue,
            //       backgroundColor: "rgba(234, 203, 103, 0.8)",
            //       content: `Total: ${formatNumber(totalValue)}`,
            //       color: "black",
            //       font: {
            //         weight: "bold",
            //       },
            //     },
            //   },
            // },
          },
          onClick: (event, elements) => {
            if (elements.length > 0) {
              const elementIndex = elements[0].index;
              const clickedDate = data[elementIndex].date;
              // navigate(`/page/${clickedDate}`);
            }
          },
        },
      });

      return () => {
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
        }
      };
    }
  }, [isChartVisible]);

  const handleMouseEnter = () => {
    setIsChartVisible(true);
    gsap.to(coinRef.current, {
      opacity: 0,
      duration: 0.2,
      onComplete: () => {
        gsap.to(chartRef.current, { opacity: 1, duration: 0.2 });
      },
    });
  };

  const handleMouseLeave = () => {
    gsap.to(chartRef.current, {
      opacity: 0,
      duration: 0.2,
      onComplete: () => {
        gsap.to(coinRef.current, {
          opacity: 1,
          duration: 0.2,
          onComplete: startAnimation,
        });
        setIsChartVisible(false);
      },
    });
  };

  if (number == null || number === 0) return null;
  return (
    <>
      <div onMouseLeave={handleMouseLeave}>
        <div className="flex-center" onMouseEnter={handleMouseEnter}>
          {!isChartVisible && (
            <div ref={coinRef} className="coin " >
              <img src={"/2.gif"} alt="coin"  className="mb-16"/>
              <div ref={textRef} className="coin-text custom-font-class">
                {formatNumber(number)}
              </div>
            </div>
          )}
        </div>
        {isChartVisible && (
          <canvas
            ref={chartRef}
            className="chart"
            width="70"
            height="20"
          ></canvas>
        )}
      </div>
    </>
  );
};

MagicCoin.propTypes = {
  number: PropTypes.number.isRequired,
};

export default MagicCoin;
