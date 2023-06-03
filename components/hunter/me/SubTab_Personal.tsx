import { $SolidAccountType, $SolidHunterAccountData } from "@/lib/globalstore";
import { FC, FormEvent, MouseEvent, useEffect, useState } from "react";

import $supabase from "@/lib/supabase";
import Cities from '@/lib/cities.json'
import Fuse from 'fuse.js'
import { IUserHunter } from "@/lib/types";
import Skills from '@/lib/skills.json'
import { useRouter } from "next/router";

const PersonalTab: FC = () => {
  const router = useRouter()
  const [tempData, setTempData] = useState<IUserHunter>(
    $SolidHunterAccountData.get(),
  );
  const [hasChanged, setHasChanged] = useState(false);
  const [primarySkillResults, setPrimarySkillResults] = useState<string[]>([]);
  const [secondarySkillResults, setSecondarySkillResults] = useState<string[]>(
    [],
  );
  const skillsFuse = new Fuse(Skills, {
    includeScore: true,
  });
  const [cityResults, setCityResults] = useState<string[]>([]);
  const citiesFuse = new Fuse(Cities, {
    includeScore: true,
    keys: ["city"],
  })
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setHasChanged(
      JSON.stringify(tempData) !==
      JSON.stringify($SolidHunterAccountData.get()),
    );
  }, [tempData]);

  const handleChanges = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsUpdating(true);
    const { error } = await $supabase
      .from("user_hunters")
      .update(tempData)
      .eq("id", tempData.id)

    if (error) {
      console.error(error);
      return
    }

    $SolidHunterAccountData.set(tempData);
    setHasChanged(false);
    setIsUpdating(false);
  }

  const handleLogout = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const { error } = await $supabase.auth.signOut();
    if (error) {
      console.error(error);
      return;
    }

    // remove data from global store and local storage
    $SolidHunterAccountData.set({} as IUserHunter);
    $SolidAccountType.set("visitor");
    window.localStorage.removeItem("data-hunter");
    router.push("/auth/login");
  }

  return (
    <form onSubmit={handleChanges} className="relative flex flex-col gap-5">
      {/* updating ovelay */}
      {isUpdating && (
        <div className="absolute w-full h-full bg-base-100/75 flex justify-center items-center">
          <div className="loading loading-spinner" />
        </div>
      )}

      <label className="flex flex-col gap-2">
        <span>Full Name</span>
        <div className="join join-vertical lg:join-horizontal">
          <input
            type="text"
            name="full_name.first"
            className="input input-primary join-item lg:flex-1"
            placeholder="First Name"
            value={tempData.full_name.first}
            onChange={(e) =>
              setTempData({
                ...tempData,
                full_name: { ...tempData.full_name, first: e.target.value },
              })
            }
          />
          <input
            type="text"
            name="full_name.middle"
            className="input input-primary join-item lg:flex-1"
            value={tempData.full_name.middle}
            placeholder="Middle Name"
            onChange={(e) =>
              setTempData({
                ...tempData,
                full_name: { ...tempData.full_name, middle: e.target.value },
              })
            }
          />
          <input
            type="text"
            name="full_name.last"
            className="input input-primary join-item lg:flex-1"
            placeholder="Last Name"
            value={tempData.full_name.last}
            onChange={(e) =>
              setTempData({
                ...tempData,
                full_name: { ...tempData.full_name, last: e.target.value },
              })
            }
          />
        </div>
      </label>
      <label className="flex flex-col gap-2">
        <span>Short Biography</span>
        <textarea
          name="bio"
          className="textarea textarea-primary overflow-y-hidden"
          placeholder="Write a short bio about yourself"
          value={tempData.bio || "No bio yet"}
          onChange={(e) => setTempData({ ...tempData, bio: e.target.value })}
          onInput={(e) => {
            e.currentTarget.style.height = "auto";
            e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
          }}
        />
      </label>
      <label className="flex flex-col gap-2">
        <span>Primary Skill</span>
        <div className="flex flex-col">
          <input
            type="text"
            name="primary_skill"
            className="input input-primary"
            placeholder="Primary Skill"
            value={tempData.skill_primary}
            onChange={(e) => {
              const tempskillList: string[] = [];

              if (e.target.value.length < 3) {
                setPrimarySkillResults([]);
              }

              setTempData({
                ...tempData,
                skill_primary: e.target.value,
              });

              if (e.target.value.length > 2) {
                skillsFuse.search(e.target.value, { limit: 10 }).forEach((result) => {
                  tempskillList.push(result.item);
                });
                setPrimarySkillResults(tempskillList);
              }

              // check if input is the same as the current skill
              if (e.target.value === tempData.skill_primary) {
                setPrimarySkillResults([]);
              }
            }}
          />
          <div className="mt-5 flex flex-wrap">
            {primarySkillResults.map((result) => (
              <button
                key={result}
                type="button"
                onClick={() => {
                  setTempData({
                    ...tempData,
                    skill_primary: result,
                  });
                  setPrimarySkillResults([]);
                }}
                className="btn btn-ghost"
              >
                {result}
              </button>
            ))}
            {primarySkillResults.length > 0 && (
              // add custom skill
              <button
                type="button"
                className="btn btn-ghost"
                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                  // remove the quotation marks and "Add" on the innerText
                  const skill = e.currentTarget.innerText;
                  const skillName = skill.slice(5, skill.length - 1);

                  setTempData({
                    ...tempData,
                    skill_primary: skillName,
                  });
                  setPrimarySkillResults([]);
                }}
              >
                Add "{tempData.skill_primary}"
              </button>
            )}
          </div>
        </div>
      </label>
      <label className="flex flex-col gap-2">
        <span>Secondary Skills</span>
        <div className="flex flex-col">
          <input
            type="text"
            name="secondary_skills"
            className="input input-primary"
            placeholder="Secondary Skills"
            onChange={(e) => {
              const tempskillList: string[] = [];

              if (e.target.value.length < 3) {
                setSecondarySkillResults([]);
                return;
              }

              const result = skillsFuse.search(e.target.value, { limit: 10 });
              result.forEach((result) => {
                tempskillList.push(result.item);
              });

              setSecondarySkillResults(tempskillList);
            }}
          />
          {secondarySkillResults.length > 0 && (
            <div className="flex flex-wrap gap-4 mt-5">
              {secondarySkillResults.map((result) => (
                <button
                  onClick={() => { }}
                  className="btn btn-ghost"
                  type="button"
                >
                  {result}
                </button>
              ))}
              {/* add custom skill based on secondary_skills input value - targetted by name */}
              <button
                type="button"
                className="btn btn-ghost"
                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                  const skill = document.querySelector<HTMLInputElement>(
                    'input[name="secondary_skills"]',
                  )?.value;

                  if (!skill) return;

                  setTempData({
                    ...tempData,
                    skill_secondary: [...tempData.skill_secondary, skill],
                  });
                  setSecondarySkillResults([]);

                  // clear input value
                  // rome-ignore lint/style/noNonNullAssertion: <explanation>
                  document.querySelector<HTMLInputElement>(
                    'input[name="secondary_skills"]',
                  )!.value = "";
                }}
              >
                Add "
                {
                  document.querySelector<HTMLInputElement>(
                    'input[name="secondary_skills"]',
                  )?.value
                }
                "
              </button>
            </div>
          )}
          <div className="mt-5 flex gap-2 flex-wrap">
            {tempData.skill_secondary.map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => {
                  const newSkills = tempData.skill_secondary.filter(
                    (s) => s !== skill,
                  );
                  setTempData({
                    ...tempData,
                    skill_secondary: newSkills,
                  });
                }}
                className="badge badge-primary badge-lg"
              >
                {skill}
              </button>
            ))}
          </div>
        </div>
      </label>
      <label className="flex flex-col gap-2">
        <span>Residency Address</span>
        <input
          type="text"
          name="residency_address"
          className="input input-primary"
          placeholder="Residency Address"
          value={tempData.address.address}
          onChange={(e) => {
            setTempData({
              ...tempData,
              address: {
                ...tempData.address,
                address: e.target.value,
              },
            });
          }}
        />
      </label>
      <label className="flex flex-col gap-2">
        <span>
          Residency City
        </span>
        <input
          type="text"
          name="residency_city"
          className="input input-primary"
          placeholder="Residency City"
          value={tempData.address.city}
          onChange={(e) => {
            const result = citiesFuse.search(e.target.value, { limit: 5 });

            const cityList: string[] = [];

            result.forEach((result) => {
              cityList.push(result.item.city);
            })

            setCityResults(cityList);

            setTempData({
              ...tempData,
              address: {
                ...tempData.address,
                city: e.target.value,
              },
            });
          }}
        />
        {
          cityResults.length > 0 && (
            <div className="flex flex-wrap gap-4 mt-5">
              {cityResults.map((result) => (
                <button
                  onClick={() => {
                    setTempData({
                      ...tempData,
                      address: {
                        ...tempData.address,
                        city: result,
                      },
                    });
                    setCityResults([]);
                  }}
                  type="button" className="btn btn-ghost">
                  {result}
                </button>
              ))}
            </div>
          )
        }
      </label>

      {/* action buttons */}
      {!isUpdating && (
        <div className="mt-16 flex gap-2 justify-end">
          <label htmlFor="logoutmodal" className="btn btn-error mr-auto">Logout</label>
          <button
            disabled={!hasChanged}
            onClick={() => {
              setTempData($SolidHunterAccountData.get());
            }}
            type="button" className="btn btn-ghost">
            Clear Changes
          </button>
          <button
            disabled={!hasChanged}
            type="submit"
            className="btn btn-success"
          >
            Save Changes
          </button>
        </div>
      )}

      {/* logout modal */}
      <>
        <input type="checkbox" id="logoutmodal" className="modal-toggle" />
        <div className="modal">
          <div className="modal-box">
            <h3 className="text-lg font-bold">Confirm Logout</h3>
            <p className="pt-4">
              Logging out will reset all data logged as cache. Do you want to continue logging out?
            </p>

            <div className="mt-10 flex gap-2 justify-end">
              <label htmlFor="logoutmodal" className="btn btn-ghost">No</label>
              <button onClick={handleLogout} type="button" className="btn btn-error">Yes</button>
            </div>
          </div>
          <label className="modal-backdrop" htmlFor="logoutmodal">Close</label>
        </div>
      </>
    </form>
  );
};

export default PersonalTab