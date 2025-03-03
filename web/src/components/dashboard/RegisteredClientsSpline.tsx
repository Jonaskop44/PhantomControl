"use client";

import useIsMobile from "@/hooks/use-mobile";
import { FC } from "react";
import type { ApexOptions } from "apexcharts";
import ReactApexChart from "react-apexcharts";

type RegisteredClientsSplineProps = {
  data: { x: string; y: number }[];
};

const RegisteredClientsSpline: FC<RegisteredClientsSplineProps> = ({
  data,
}) => {
  const isMobile = useIsMobile();

  const options: ApexOptions = {
    legend: { show: false },
    colors: ["#5750F1"],
    chart: {
      height: 310,
      type: "area",
      toolbar: { show: false },
      fontFamily: "inherit",
    },
    fill: { gradient: { opacityFrom: 0.55, opacityTo: 0 } },
    responsive: [{ breakpoint: 1024, options: { chart: { height: 300 } } }],
    stroke: { curve: "smooth", width: isMobile ? 2 : 3 },
    grid: { strokeDashArray: 5, yaxis: { lines: { show: true } } },
    dataLabels: { enabled: false },
    tooltip: { marker: { show: true } },
    xaxis: { axisBorder: { show: false }, axisTicks: { show: false } },
  };

  return (
    <div className="-ml-4 -mr-5 h-[310px]">
      <ReactApexChart
        options={options}
        series={[{ name: "Registrierungen", data }]}
        type="area"
        height={310}
      />
    </div>
  );
};

export default RegisteredClientsSpline;
