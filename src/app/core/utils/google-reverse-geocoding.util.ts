export function geocode(address: string) {
  const geocoder = new google.maps.Geocoder();

  return new Promise((resolve, reject) => {
    geocoder.geocode({ 'address': address }, function (results: any, status: any) {
      if (status == 'OK') resolve(results[0].geometry.location)
      else reject(null)
    });
  })
}
