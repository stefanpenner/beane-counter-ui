import { percentageOfSeason, percentageOfData , precision} from 'appkit/utils/percentage_of_data';

test("percentage of season", function(){
  equal(precision(0.5934065934, 100), percentageOfSeason(200, 2007));
  equal(precision(0.043956044, 100), percentageOfSeason(100, 2007));
});

test("percentage in data", function(){
  equal(precision(0.169544741, 100), percentageOfData(200, 2007));
  equal(precision(0.0125588697, 100), percentageOfData(100, 2007));
});
