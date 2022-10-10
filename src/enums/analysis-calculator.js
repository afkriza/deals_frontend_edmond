function createRoomType(id, name) {
  return {
    id,
    name
  };
}

export const RoomTypes = {
  Single: createRoomType('single', 'Single'),
  Double: createRoomType('double', 'Double'),
  Triple: createRoomType('triple', 'Triple'),
  Family: createRoomType('family', 'Family'),
  Suite: createRoomType('suite', 'Suite')
};
