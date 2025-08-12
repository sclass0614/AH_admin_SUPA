function checkSupabaseInitialized() {
  if (!supabase) {
    console.error("Supabase 클라이언트가 초기화되지 않았습니다.");
    return false;
  }
  return true;
}

async function loadEmployeeList() {
  if (!checkSupabaseInitialized()) return [];

  try {
    const { data, error } = await supabase.auth.admin.listUsers();

    if (error) {
      console.error("직원 목록 불러오기 실패:", error);
      return [];
    }

    const employees = data.users.map(user => {
      const employeeId = user.email.split('@')[0];
      
      return {
        employeeId: employeeId,
        name: user.user_metadata?.name || '이름 없음',
        password: '********'
      };
    });

    return employees;
  } catch (error) {
    console.error("직원 목록 처리 중 오류 발생:", error);
    return [];
  }
}