const {useRef, useEffect} = React

export function useEffectUpdate(cb, dependencies){
    
    const counterRef = useRef(0)
    
    useEffect(()=>{
        if (!counterRef.current) {
            counterRef.current++
            return
        }
        return cb()

    
    }, dependencies)
}