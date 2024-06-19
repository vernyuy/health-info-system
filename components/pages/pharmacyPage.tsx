"use client";

import { signOut } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import NavBar from "@/components/common-components/navbar";
import Link from "next/link";
import FeatureCard from "@/components/featurCard";
import Footer from "@/components/footer";
import { FormEvent, useEffect, useState } from "react";
import { generateClient } from "aws-amplify/data";
import { type Schema } from "@/amplify/data/resource";
import CardTwo from "../cardTwo";
import ImageCard from "../imageCard";
import Script from "next/script";

export default function PharmacyPage() {
  const client = generateClient<Schema>();
  const router = useRouter();
  const [filter, setFilter] = useState(false);
  const [lng, setLng] = useState(0);
  const [pharmacies, setPharmacies] = useState<
    Array<Schema["Pharmacy"]["type"]>
  >([]);
  const [nearPharms, setNearPharms]: any = useState([]);

  useEffect(() => {
    getAllPharmacies();
  }, []);

  // useEffect(() => {
  //   console.log(pharmacies)
  //   filterNearPharmacies()
  // }, [pharmacies, lat, lng]);
  const getAllPharmacies = async () => {
    // console.log("getting all pharmacies")
    try {
      client.models.Pharmacy.observeQuery().subscribe({
        next: (data) => setPharmacies([...data.items]),
      });
    } catch (err) {
      console.log(err);
    }
  };

  const filterNearPharmacies = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFilter(true);
    const formData = new FormData(event.currentTarget);
    console.log(formData);
    const lt = parseFloat(formData.get("lt")?.toString()!);
    const lg = parseFloat(formData.get("lg")?.toString()!);
    console.log("filtering>>>", lt, lg);
    // 4.171662, 9.285218    4.159330, 9.276489    4.161479, 9.292015  result 0.002149  0.015526
    if (pharmacies) {
      pharmacies.map((p: any) => {
        if ((p.location?.lat - lt > 0.005) && (p.location?.long - lg > 0.04)) {
          console.log(p.location.lat, p.location?.long);
          setNearPharms([...nearPharms, p]);
        } else {
          console.log("not near", p.location.lat, p.location.long);
        }
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace("/signin");
  };
  return (
    <>
      <Script id="show-banner">
        {`
                    let lat;
                    let lng;
                    if(navigator.geolocation){
                        navigator.geolocation.getCurrentPosition((position)=>{
                            lat = position.coords.latitude;
                            lng = position.coords.longitude;
                            let inputF = document.getElementById("id1");
                            inputF.value = lat;

                            let inputF2 = document.getElementById("id2");
                            inputF2.value = lng;
                        })
                    }
               `}
      </Script>
      <div className="bg-blue-100/40 pt-4">
        <div className="h-full w-full">
          <div className="h-full w-full bg-blur sticky top-5 z-50">
            <div className="mx-auto bg-white/40 w-[85%] border shadow shadow-lg rounded-full">
              <NavBar />
            </div>
          </div>
          <div className="h-[70%]">
            <div className=" my-auto sm:flex w-full px-4 sm:px-20 justify-between gap-4">
              <div className="mt-16 mx-auto">
                <div>
                  <h2 className="text-5xl font-bold my-6 sm:pl-4">
                    Discover Top Rated Pharmacies Near You
                  </h2>
                </div>
                <div>
                  <button onClick={() => handleSignOut()}>Sign Out</button>
                </div>
              </div>
              <div className="sm:my-20 sm:px-20">
                <p className="text-justify">
                  Whether you are seeking a specialist or a primary care
                  physician, explore our directory to dicover the perfect match
                  for your healthcare needs.
                </p>
                <div className="mt-20">
                  <Link
                    href=""
                    className="text-white bg-black shadow shadow-lg border rounded-full px-8 py-3"
                  >
                    Explore
                  </Link>
                </div>
              </div>
            </div>
            <div className="h-10 bg-gradient-to-b from-blue-100/10 to-white"></div>

            <div className="bg-white px-4 sm:px-24 sm:flex gap-3 justify-between">
              <ImageCard
                cardData={{
                  title: "Health Care Providers",
                  description:
                    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta harum tempore qui mollitia doloremque repudiandae asperiores eligendi tempora eum,",
                  url: "",
                  image: "/pharm.png",
                }}
              />

              <CardTwo
                cardData={{
                  title: "Health Care Providers",
                  description:
                    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta harum tempore qui mollitia doloremque repudiandae asperiores eligendi tempora eum,",
                  url: "",
                  image: "/pharm.png",
                }}
              />
            </div>
            <div className="h-screen w-screen bg-white pt-20">
              <div className="flex pb-12 flex-col">
                <div className="absolute bg-blue-400 h-[250px] w-[150px] pl-3 left-2 rounded-lg ">
                  <div className="flex flex-col gap-2">
                    <p className="font-bold text-white text-lg mx-auto pb-4"> Filters</p>
                    
                <div className="">
                  <button onClick={()=>setFilter(false)} className="">All pharmacies</button>
                </div>
                <form onSubmit={filterNearPharmacies} className=" h-[20px] relative">
                  <input
                    className="invisible"
                    step="0.00000001"
                    type="number"
                    id="id1"
                    name="lt"
                  />
                  <input
                    className="invisible"
                    step="0.00000001"
                    type="number"
                    id="id2"
                    name="lg"
                  />
                  <div className=" absolute top-0 w-full">
                    <button className="w-full text-left" type="submit">Near by Pharms</button>
                  </div>
                </form>
                  </div>
                  
                </div>

                
                <div className="mx-auto">
                  <h1 className="text-3xl font-bold pb-2">Pharmacies</h1>
                  <div className="flex gap-1">
                    <div className="w-6 h-2 bg-blue-500 rounded-full"></div>
                    <div className="w-6 h-2 bg-blue-500 rounded-full"></div>
                    <div className="w-full h-2 bg-blue-500 rounded-full"></div>
                  </div>
                </div>
              </div>
              {filter ? (
                <div className=" px-1 sm:px-24 pt-10 flex flex-wrap justify-evenly gap-3">
                  {nearPharms.map(
                    (pharm: any) => (
                      <FeatureCard
                        key={pharm.id}
                        cardData={{
                          title: pharm.name,
                          description: pharm.description,
                          url: "",
                          image: pharm.imageUrl ? pharm.imageUrl : "/pharm.png",
                        }}
                      />
                    )
                  )}
                </div>
              ) : (
                <div className=" px-1 sm:px-24 pt-10 flex flex-wrap justify-evenly gap-3">
                  {pharmacies.map(
                    (pharm: any) => (
                      <FeatureCard
                        key={pharm.id}
                        cardData={{
                          title: pharm.name,
                          description: pharm.description,
                          url: "",
                          image: pharm.imageUrl ? pharm.imageUrl : "/pharm.png",
                        }}
                      />
                    )
                  )}
                </div>
              )}
              <Footer />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
