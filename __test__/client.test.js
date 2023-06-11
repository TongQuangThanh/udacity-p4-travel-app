import { getTimeUntilDate } from '../src/client/js/app'

describe("Test API call", () => {

    it("returns good data", async () => {
        const today = new Date();
        const date = 30;
        expect(getTimeUntilDate(`2023-06-${date}`)).toEqual(date - today.getDate());
    })
})
