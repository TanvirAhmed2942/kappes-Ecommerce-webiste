import MonthlyEarningChart from '../../../../components/SellerDahsboard/overview/MonthlyEarningChart';
import StatCards from '../../../../components/SellerDahsboard/overview/StatCards';
import TotalOrderChart from '../../../../components/SellerDahsboard/overview/TotalOrderChart';

const page = () => {
  return (
    <div className='space-y-5'>
      <StatCards />
      <TotalOrderChart />
      <MonthlyEarningChart />
    </div>
  );
};

export default page;