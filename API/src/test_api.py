import unittest
from urllib import response
from app import app




# EXAMPLE TEST ADD TWO NUMBERS
""" def addTwoNumbers(a, b):
     return a + b


class AddTest(unittest.TestCase):
     def test1(self):
         c = addTwoNumbers(5, 10) #  15
         self.assertEqual(c, 15)

     def test2(self):
         c = addTwoNumbers(5, 10)
         self.assertNotEqual(c, 10) """



class ApiTest(unittest.TestCase):

    API_URL = "http://127.0.0.1:5000"
    INIT_DAY = "2022-01-01"
    END_DAY = "2022-01-31"
    DEVICE = "Lavadora"
    DATA_RANGE = "{}/powerDateRange/{}/{}".format(API_URL, INIT_DAY, END_DAY)
    DATA_HOUR = "{}/powerHour/{}/{}/{}".format(API_URL, INIT_DAY, END_DAY, DEVICE)
    DATA_REPORT = "{}/powerMonthReport/{}/{}".format(API_URL, INIT_DAY, END_DAY)
    
    """ # Check if the response is 200
    def test1_api(self):
        tester = app.test_client(self)
        response = tester.get("/fo")
        self.assertEqual(response.status_code, 200) """

    #  Check if content returned is json
    def test1_content(self):
        tester = app.test_client(self)
        response = tester.get("/fo")
        self.assertEqual(response.content_type, "application/json")

    # Check GET request to /powerDateRange/<initDay>/<endDay> return data in a date range
    # Check if the number of elements returned is 5 (Lavadora, Microondas, Nevera, Otros y Total) in month (January)
    def test2_getDateRange(self):
        tester = app.test_client(self)
        response = tester.get(self.DATA_RANGE)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json), 5)


    # Check GET request to /powerHour/<initDay>/<endDay>/<device> return power data by hour
    # Check if the number of elements returned is 31 (31 days in January)
    def test3_getDateHour(self):
        tester = app.test_client(self)
        response = tester.get(self.DATA_HOUR)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json), 31) # 31 days in January


    # Check GET request to /powerMonthReport/<initDay>/<endDay> return power data by month  
    # Check if the number of elements returned is 5 (Lavadora, Microondas, Nevera, Otros y Total) in month (January)
    def test4_getDataReport(self):
        tester = app.test_client(self)
        response = tester.get(self.DATA_REPORT)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json), 1) # 1 month (January)
        self.assertEqual(len((response.json)[0]["datos"]), 5) # 5 devices
        



    

#if __name__ == '__main__':
#    unittest.main()

