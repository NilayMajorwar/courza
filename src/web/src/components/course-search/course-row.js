import * as React from 'react';
import { Icon, Text } from '../../elements';

const CourseRow = (props) => {
  const course = props.course;
  return (
    <div className="search-result" onClick={() => props.onClick(course)}>
      <div className="search-result__left">
        <Text medium>{course.code}</Text>
        <span style={{ margin: 10 }}>
          <Icon name="person" color="#a0a0a0"></Icon>
          <Text note className="">
            {course.numOfStudents}
          </Text>
        </span>
        <br></br>
        <Text small note>
          {course.name}
        </Text>
      </div>
      <div className="search-result__right">
        <Icon name="person" color="#a0a0a0"></Icon>
        <Text note>{course.numOfStudents}</Text>
      </div>
    </div>
  );
};

export default CourseRow;
