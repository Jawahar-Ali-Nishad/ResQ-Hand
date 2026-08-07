import { useState } from "react";
import { skills } from "./Districts";

export default function Skillcheckbox({
  title,
  selectedSkills,
  setSelectedSkills,
  excludedSkills = [],
  max = 3,
}) {
  const [showDropdown, setShowDropdown] = useState(false);

  const availableSkills = skills.filter(
    (skill) => !excludedSkills.includes(skill)
  );

  const handleSkill = (skill) => {
    // Remove if already selected
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(
        selectedSkills.filter((item) => item !== skill)
      );
      return;
    }

    // Limit reached
    if (selectedSkills.length >= max) {
      alert(`You can select only ${max} skills.`);
      return;
    }

    // Add skill
    setSelectedSkills([...selectedSkills, skill]);
  };

  return (
    <div className="skill-container">

      <div
        className="skill-header"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <span>
          {title} ({selectedSkills.length}/{max})
        </span>

        <span>{showDropdown ? "▲" : "▼"}</span>
      </div>

      {showDropdown && (
        <div className="skill-body" >

          {availableSkills.map((skill) => (
            <label key={skill}>

              <input
                type="checkbox"
                checked={selectedSkills.includes(skill)}
                disabled={
                  selectedSkills.length >= max &&
                  !selectedSkills.includes(skill)
                }
                onChange={() => handleSkill(skill)}
              />

              {skill}

            </label>
          ))}

        </div>
      )}

    </div>
  );
}