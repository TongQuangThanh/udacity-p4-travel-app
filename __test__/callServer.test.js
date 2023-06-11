import { callServer } from '../src/client/js/apiCalls'

describe("Test API call", () => {

    it("returns good data", async () => {
        const bigData = {
            userData: {
                startDate: "2023-06-09",
                city: "Hanoi",
                endDate: "2020-06-13",
                timeUntilReturn: 4,
                timeUntilTrip: 0,
                tripDuration: 4,
                units: "M"
            }
        }
        const response = await callServer('getGeolocation', bigData)
        expect(response.geonames[0].countryCode).toBe('VN')
    })

})
