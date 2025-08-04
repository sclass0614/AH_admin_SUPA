// Supabase 인증 관련 기능을 관리하는 스크립트

// Supabase 클라이언트가 초기화되었는지 확인
function checkSupabaseInitialized() {
  if (!supabase) {
    console.error("Supabase 클라이언트가 초기화되지 않았습니다.");
    return false;
  }
  return true;
}

// 직원 목록을 불러오는 함수
async function loadEmployeeList() {
  if (!checkSupabaseInitialized()) return [];

  try {
    // Admin API를 통해 사용자 목록 불러오기
    const { data, error } = await supabase.auth.admin.listUsers();

    if (error) {
      console.error("직원 목록 불러오기 실패:", error);
      return [];
    }

    // 사용자 데이터 가공
    const employees = data.users.map(user => {
      // 이메일에서 @ 앞부분만 추출하여 직원번호로 사용
      const employeeId = user.email.split('@')[0];
      
      return {
        employeeId: employeeId,
        name: user.user_metadata?.name || '이름 없음',
        password: '********' // 보안상 비밀번호는 표시하지 않음
      };
    });

    return employees;
  } catch (error) {
    console.error("직원 목록 처리 중 오류 발생:", error);
    return [];
  }
}
