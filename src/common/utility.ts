const recursiveToSnake = (item: unknown): unknown => {
    if (Array.isArray(item)) {
      return item.map((el: unknown) => recursiveToSnake(el));
    } else if (typeof item === 'function' || item !== Object(item)) {
      return item;
    }
    return Object.fromEntries(
      Object.entries(item as Record<string, unknown>).map(
        ([key, value]: [string, unknown]) => [
          key.replace(/[A-Z]/g, (m) => '_' + m.toLowerCase()),
          recursiveToSnake(value),
        ],
      ),
    );
  };
  
  const recursiveToCamel = (item: unknown): unknown => {
    if (Array.isArray(item)) {
      return item.map((el: unknown) => recursiveToCamel(el));
    } else if (typeof item === 'function' || item !== Object(item)) {
      return item;
    }
    return Object.fromEntries(
      Object.entries(item as Record<string, unknown>).map(
        ([key, value]: [string, unknown]) => [
          key.replace(/([-_][a-z])/gi, c => c.toUpperCase().replace(/[-_]/g, '')),
          recursiveToCamel(value),
        ],
      ),
    );
  };

  const formatTime = (item: { [s: string]: unknown; } | ArrayLike<unknown>) => {
    return Object.entries(item).map(([,value]) => {
    
      return value
    })
    // return Object.fromEntries(
    //   Object.entries(item as Record<string, unknown>).map(
    //     ([key, value]: [string, unknown]) => [
    //       key,
    //       value.map(({from,to})=>{
    //         return {from:from.format(format), to:to.format(format)}
    //       })
    //     ],
    //   ),
    // );
  }
  
export {recursiveToSnake, recursiveToCamel, formatTime};