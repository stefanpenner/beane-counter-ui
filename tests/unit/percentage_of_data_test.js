import { percentageOfSeason, percentageOfData , precision } from 'appkit/utils/percentage_of_data';

test("percentage of season", function(){
  equal(precision(0.5934065934, 100), percentageOfSeason(200, 2007));
  equal(precision(0.043956044, 100),  percentageOfSeason(100, 2007));
});

test("percentage in data", function(){
  equal(percentageOfData(200, 2007), 0.09);
  equal(percentageOfData(100, 2007), 0.00);
  equal(percentageOfData(200, 2012), 0.91);
  equal(percentageOfData(274, 2012), 0.98);
});
