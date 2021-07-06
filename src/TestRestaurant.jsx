import React from 'react';
import {useQuery} from "react-query";
import { useState } from 'react';
import {Badge, Button, Progress} from "shards-react";
import styled from 'styled-components';

const URL = 'https://mtlatable.mtl.org/en/search-restaurants?neighborhood=GenLoc-VieuxMtl,GenLoc-VieuxPort,GenLoc-Plateau,GenLoc-PItalie,GenLoc-Village,GenLoc-CV,GenLoc-MCarre,GenLoc-QdesSpec,GenLoc-QInternat,&pageContext=%2Fen%2Frestaurants';

const useRestaurantsData = () => {
  const [progress, setProgress] = useState(0);
  const queryInfo = useQuery(['test'],
    async () => {
      let allitems = [];
      let numberOfItems = 1000;
      let i = 0;
      while (numberOfItems > allitems.length) {
        const resp = await fetch(i++ > 0 ? `${URL}&page=${i}` : URL);
        const _jsonResp = await resp.json();
        if (numberOfItems === 1000) {
          numberOfItems = _jsonResp.count;
        }
        allitems = [...allitems, ..._jsonResp.hits];
        setProgress(allitems.length/numberOfItems * 100);
      }
      return allitems;
    },
    {
      refetchOnWindowFocus: false,
      cacheTime: Infinity
    }
  )
  return {
    ...queryInfo,
    progress
  }
};


export const Test = () => {
  const {data, isLoading, progress} = useRestaurantsData();
  const [randomRestaurant, setRandomRestaurant] = useState();

  if (isLoading || !data) {
    return (<Container style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
      <Text>Loading...</Text>
      <div style={{ width: '100%',backgroundColor: 'white'}}>
        <Progress bar={true} animated={true} value={progress} max={100} />
      </div>
    </Container>);
  }
  const qty = data.length;
  const randomItem = data[randomRestaurant];

  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <ContainerInfo style={{ justifyContent: 'center', alignItems: 'center'}}>
        <Title style={{ fontSize: 30 }}>Pick a random MTLàTABLE restaurant out of {qty}!</Title>
        <Button style={{margin: 12}} onClick={() => {
          setRandomRestaurant(Math.floor(Math.random() * qty))
        }}>Get random</Button>
      </ContainerInfo>

      {randomRestaurant !== undefined && <Restaurant data={randomItem} />}
    </div>
  )
}

const Restaurant = ({ data }) => {
  if (!data) {
    return null;
  }
  return (
    <Container>
      <Image src={data.background_image_url} alt={''}/>
      <ContainerInfo>
      <SubContainerInfo>
        <Title style={{fontWeight: 'bold', marginTop: 12}}>{data.title}</Title>
        <div style={{marginBottom: 12, marginTop: 4}}>
          {Boolean(data.byow) && <StyledBadge theme="info">Byow</StyledBadge>}
          {Boolean(data.brunch) && <StyledBadge theme="info">Brunch</StyledBadge>}
          {Boolean(data.vegan) && <StyledBadge theme="info">Vegan</StyledBadge>}
          {Boolean(data.vegetarian) && <Badge theme="info">Vegetarian</Badge>}
        </div>
        {data.summary && <SubContainer >
          <SubTitle>Summary:</SubTitle>
          <Text style={{maxWidth: 350}}>{data.summary}</Text>
        </SubContainer>}
        <SubContainer >
          <SubTitle>Price:</SubTitle>
          <TextBold>{data.price}</TextBold>
        </SubContainer>
        <SubContainer>
          <SubTitle>DaysOpen:</SubTitle>
          <div>
            {data.week_days?.map((_day, i) => <StyledBadge key={i}>{ _day }</StyledBadge>)}
          </div>
        </SubContainer>
      </SubContainerInfo>
        <Link target="_blank" href={`https://mtlatable.mtl.org/${data.url}`} >Go to website</Link>
      </ContainerInfo>
    </Container>
  )
}

const Container = styled.div`
display: flex;
flex-direction: row;
width: 100%;
padding-right: 24px;
padding-left: 24px;
align-items: center;
`;

const ContainerInfo = styled.div`
  margin-left: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const SubContainerInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const SubContainer = styled.div`
display: flex;
flex-direction: column;
margin-bottom: 12px;
`;


const Image = styled.img`
width: 300px;
height: 300px;
`;

const Text = styled.span`
  color: white;
  font-size: 16px;
`;

const TextBold = styled(Text)`
  font-weight: bold;
`;

const SubTitle = styled(TextBold)`
  font-size: 20px;
`;

const Title = styled(TextBold)`
  font-size: 30px;
`;

const Link = styled.a`
  text-decoration: underline;
  text-decoration-color: white;
  color: white;
  font-weight: bold;
  font-style: italic;
  font-size: 20px;
`;

const StyledBadge = styled(Badge)`
  margin-right: 4px;
`
