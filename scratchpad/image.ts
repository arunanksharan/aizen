import * as fs from 'fs';
import * as path from 'path';

async function getImage() {
  const imageResponse = await fetch(
    'https://cdn.openart.ai/published/KuNdla1OswlPZGzCtehL/1MMIr_dX_Il4k_1024.webp',
    {
      method: 'GET', // or 'POST', 'PUT', etc.
      headers: {
        'Content-Type': 'application/json',
        Cookie:
          'AMP_MKTG_3e2fda7a5c=JTdCJTIycmVmZXJyZXIlMjIlM0ElMjJodHRwcyUzQSUyRiUyRnd3dy5nb29nbGUuY29tJTJGJTIyJTJDJTIycmVmZXJyaW5nX2RvbWFpbiUyMiUzQSUyMnd3dy5nb29nbGUuY29tJTIyJTdE; AMP_3e2fda7a5c=JTdCJTIyZGV2aWNlSWQlMjIlM0ElMjI4NDVlNzlmMC04ZmJkLTQyYzMtOTAwZC01ZmVkYjExNTA5OGYlMjIlMkMlMjJ1c2VySWQlMjIlM0ElMjJNWnNIcUo0bzZLNTNkb3N1aUxpZyUyMiUyQyUyMnNlc3Npb25JZCUyMiUzQTE3MTA5NjI4MTI3MDElMkMlMjJvcHRPdXQlMjIlM0FmYWxzZSUyQyUyMmxhc3RFdmVudFRpbWUlMjIlM0ExNzEwOTY0NjM3MjMwJTJDJTIybGFzdEV2ZW50SWQlMjIlM0E4JTdE; __Secure-next-auth.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..k5NBcKgI__Qahvgr.O6sQFcJ3o5kF7D6YPIjvd44Nh-j3z9SK9Pr2U2gGVNK3wHL-zSS9vvV_QQVuPccRD6dNYHICfO8aX6OM6UsupNsT6G0kQUBut6HwVBSydqFqX-F1ns8BI6t21WVNk9VyWsEHhR7hV4UfFVrAxE0R0oziA3Xb_OhV-S27IWT0d9FLqIQD1ocX8P7YXfdcgZLCNvEU3aqR2aAwpFsGGgOZaNmMe2-jkrFC87e8qPdYOIpyW1N4jH3s8_p5Y3uVhP-nrbGY_IeMljlWdBY6BWUy-FlFBs7-B_CB6calZU-4H0Sx1WXKQ-y_Lbgy7D9HU7U-HVZAanADarjbuXXrt5z5sYbEHCxbcxLY2xEFI48.xdENZkqjJ2VK0G25tr5fHA',
      },
      credentials: 'include', // this will ensure that cookies are sent with the request
    }
  );
  const imageBlob = await imageResponse.blob();
  console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
  console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
  console.log('imageBlob', imageBlob);
  console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
  console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
  //   console.log('ImageResponse', imageResponse);
  imageBlob.arrayBuffer().then((buffer) => {
    console.log('Buffer', buffer);
  });

  // Write to file in data folder here
  const filePath_buffer = path.resolve(__dirname, 'data', 'image1.webp');
  //   const filePath_blob = path.resolve(__dirname, 'data', 'image_blob.webp');
  const arrayBuffer = await imageBlob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  fs.writeFileSync(filePath_buffer, buffer);
  console.log('Buffer', buffer);
  //   fs.writeFileSync(filePath_blob, imageBlob);
  //   fs.writeFileSync(filePath, imageBlob);

  //   console.log('ImageBlob as array buffer', imageBlob.arrayBuffer());
  console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
  console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
}

getImage();

//   Cookie:
// AMP_MKTG_3e2fda7a5c=JTdCJTIycmVmZXJyZXIlMjIlM0ElMjJodHRwcyUzQSUyRiUyRnd3dy5nb29nbGUuY29tJTJGJTIyJTJDJTIycmVmZXJyaW5nX2RvbWFpbiUyMiUzQSUyMnd3dy5nb29nbGUuY29tJTIyJTdE;

// AMP_3e2fda7a5c=JTdCJTIyZGV2aWNlSWQlMjIlM0ElMjI4NDVlNzlmMC04ZmJkLTQyYzMtOTAwZC01ZmVkYjExNTA5OGYlMjIlMkMlMjJ1c2VySWQlMjIlM0ElMjJNWnNIcUo0bzZLNTNkb3N1aUxpZyUyMiUyQyUyMnNlc3Npb25JZCUyMiUzQTE3MTA5NjI4MTI3MDElMkMlMjJvcHRPdXQlMjIlM0FmYWxzZSUyQyUyMmxhc3RFdmVudFRpbWUlMjIlM0ExNzEwOTY0NjM3MjMwJTJDJTIybGFzdEV2ZW50SWQlMjIlM0E4JTdE; __Secure-next-auth.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..k5NBcKgI__Qahvgr.O6sQFcJ3o5kF7D6YPIjvd44Nh-j3z9SK9Pr2U2gGVNK3wHL-zSS9vvV_QQVuPccRD6dNYHICfO8aX6OM6UsupNsT6G0kQUBut6HwVBSydqFqX-F1ns8BI6t21WVNk9VyWsEHhR7hV4UfFVrAxE0R0oziA3Xb_OhV-S27IWT0d9FLqIQD1ocX8P7YXfdcgZLCNvEU3aqR2aAwpFsGGgOZaNmMe2-jkrFC87e8qPdYOIpyW1N4jH3s8_p5Y3uVhP-nrbGY_IeMljlWdBY6BWUy-FlFBs7-B_CB6calZU-4H0Sx1WXKQ-y_Lbgy7D9HU7U-HVZAanADarjbuXXrt5z5sYbEHCxbcxLY2xEFI48.xdENZkqjJ2VK0G25tr5fHA
