export function getFirstAdult() {
  return {
    firstName: 'Kalle',
    lastName: 'Kula',
    gender: 'male',
    age: '52',
    baggage: true,
    ageType: 'vuxen',
    email: 'devtest@etraveli.com',
    phone: '12345678',
    street: 'Teststreet 19',
    zipCode: '12345',
    city: 'Testcity',
    company: 'Test Company',
    vatNumber: '1234566788',
    passPortNr: 'A12345678',
  };
}

export function getSecondAdult() {
  return {
    firstName: 'Lotta',
    lastName: 'Kula',
    gender: 'female',
    age: '44',
    baggage: false,
    ageType: 'vuxen',
    passPortNr: 'B47328914',
  };
}

export function getThirdAdult() {
  return {
    firstName: 'Leif',
    lastName: 'Karlsson',
    gender: 'male',
    age: '60',
    baggage: true,
    passPortNr: 'C30092775',
  };
}

export function getFourthAdult() {
  return {
    firstName: 'Lovisa',
    lastName: 'Lindberg',
    gender: 'female',
    age: '53',
    passPortNr: 'D47599722',
  };
}

export function getFirstChild() {
  return {
    firstName: 'Agnes',
    lastName: 'Kula',
    gender: 'female',
    age: '17',
    baggage: true,
    ageType: 'barn',
    passPortNr: 'E56565699',
  };
}

export function getSecondChild() {
  return {
    firstName: 'Beata',
    lastName: 'Hansson',
    gender: 'female',
    age: '7',
    baggage: true,
    ageType: 'barn',
  };
}

export function getFirstInfant() {
  return {
    firstName: 'Lovisa',
    lastName: 'Kula',
    gender: 'female',
    age: '1',
    ageType: 'spädbarn',
    passPortNr: 'F79001542',
  };
}

export function getSecondInfant() {
  return {
    firstName: 'Leon',
    lastName: 'Berg',
    gender: 'male',
    age: '1',
    ageType: 'spädbarn',
  };
}

export function addNumberToTraveler(travelers) {
  const travelersWithNumber = travelers;
  for (let i = 0; i < travelersWithNumber.length; i += 1) {
    travelersWithNumber[i].nr = i;
  }
  return travelersWithNumber;
}
