import { useState, useEffect } from "react";

export default const twoWayBinding = function( setter ){
    const [ value, setValue ] = useState(0);
    useEffect( function(){
        setValue( value + 1 );
    }, [ label, ...dependencies ]);
    return label + ': ' + value;
};
// ...const value = useMyHook('counter', [ dependentValue, otherDependentValue ]);