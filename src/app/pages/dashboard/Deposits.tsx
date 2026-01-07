import * as React from "react";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Title from "./Title";
import dayjs from "dayjs";

function preventDefault(event: React.MouseEvent) {
  event.preventDefault();
}

export default function Deposits({ title, subTitle }) {
  const now = dayjs().format("YYYY, MMM DD");
  return (
    <React.Fragment>
      <Title>{title}</Title>
      <Typography component="p" variant="h4" sx={{color:'#339', fontSize:'1.5rem', fontWeight:'600'}}>
        {subTitle}
      </Typography>
      {/* <Typography color="text.secondary" sx={{ flex: 1 }}>
        {`on ${now}`}
      </Typography> */}
      {/* <div>
        <Link color="primary" onClick={preventDefault}>
          More
        </Link>
      </div> */}
    </React.Fragment>
  );
}
